-- Create memory_triggers table
CREATE TABLE IF NOT EXISTS memory_triggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL DEFAULT '[]',
    actions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMPTZ,
    trigger_count INTEGER DEFAULT 0,
    settings JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger_notifications table
CREATE TABLE IF NOT EXISTS trigger_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trigger_id UUID NOT NULL REFERENCES memory_triggers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    actions JSONB DEFAULT '[]',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memory_triggers_user_id ON memory_triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_triggers_is_active ON memory_triggers(is_active);
CREATE INDEX IF NOT EXISTS idx_memory_triggers_conditions ON memory_triggers USING GIN(conditions);
CREATE INDEX IF NOT EXISTS idx_trigger_notifications_user_id ON trigger_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_trigger_notifications_trigger_id ON trigger_notifications(trigger_id);
CREATE INDEX IF NOT EXISTS idx_trigger_notifications_is_read ON trigger_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_trigger_notifications_created_at ON trigger_notifications(created_at);

-- Create updated_at trigger for memory_triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memory_triggers_updated_at 
    BEFORE UPDATE ON memory_triggers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE memory_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_notifications ENABLE ROW LEVEL SECURITY;

-- Memory triggers policies
CREATE POLICY "Users can view their own memory triggers" ON memory_triggers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory triggers" ON memory_triggers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory triggers" ON memory_triggers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory triggers" ON memory_triggers
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger notifications policies
CREATE POLICY "Users can view their own trigger notifications" ON trigger_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trigger notifications" ON trigger_notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trigger notifications" ON trigger_notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trigger notifications" ON trigger_notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Create analytics function
CREATE OR REPLACE FUNCTION get_trigger_analytics(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_triggers', (SELECT COUNT(*) FROM memory_triggers WHERE memory_triggers.user_id = get_trigger_analytics.user_id),
        'active_triggers', (SELECT COUNT(*) FROM memory_triggers WHERE memory_triggers.user_id = get_trigger_analytics.user_id AND is_active = true),
        'total_activations', (SELECT COALESCE(SUM(trigger_count), 0) FROM memory_triggers WHERE memory_triggers.user_id = get_trigger_analytics.user_id),
        'unread_notifications', (SELECT COUNT(*) FROM trigger_notifications WHERE trigger_notifications.user_id = get_trigger_analytics.user_id AND is_read = false),
        'triggers_by_type', (
            SELECT json_object_agg(condition_type, count)
            FROM (
                SELECT 
                    condition->>'type' as condition_type,
                    COUNT(*) as count
                FROM memory_triggers, 
                     jsonb_array_elements(conditions) as condition
                WHERE memory_triggers.user_id = get_trigger_analytics.user_id
                GROUP BY condition->>'type'
            ) as type_counts
        ),
        'recent_activity', (
            SELECT json_agg(
                json_build_object(
                    'trigger_name', name,
                    'last_triggered', last_triggered,
                    'trigger_count', trigger_count
                )
            )
            FROM memory_triggers 
            WHERE memory_triggers.user_id = get_trigger_analytics.user_id 
            AND last_triggered IS NOT NULL
            ORDER BY last_triggered DESC
            LIMIT 10
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
