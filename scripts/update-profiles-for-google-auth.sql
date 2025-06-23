-- Add Google OAuth support to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS provider_id TEXT,
ADD COLUMN IF NOT EXISTS google_avatar_url TEXT;

-- Create index for provider lookups
CREATE INDEX IF NOT EXISTS idx_profiles_provider ON profiles(provider, provider_id);

-- Update existing profiles to have email provider
UPDATE profiles SET provider = 'email' WHERE provider IS NULL;

-- Create function to handle new Google users
CREATE OR REPLACE FUNCTION handle_new_google_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if this is a Google OAuth user and profile doesn't exist
  IF NEW.raw_app_meta_data->>'provider' = 'google' AND 
     NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
    
    INSERT INTO profiles (
      id,
      email,
      username,
      display_name,
      avatar_url,
      google_avatar_url,
      provider,
      provider_id,
      mood_status,
      ambient_theme,
      badges,
      stats,
      is_verified,
      followers,
      following,
      total_likes,
      joined_at,
      last_active,
      preferences
    ) VALUES (
      NEW.id,
      NEW.email,
      LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTRING(NEW.id::text, 1, 8),
      COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'avatar_url',
      'google',
      NEW.raw_user_meta_data->>'sub',
      jsonb_build_object(
        'current', 'cosmic',
        'emoji', '✨',
        'lastUpdated', NOW(),
        'ambientColor', '#8B5CF6',
        'intensity', 5,
        'isPublic', true
      ),
      jsonb_build_object(
        'primary', '#8B5CF6',
        'secondary', '#EC4899',
        'accent', '#06B6D4',
        'name', 'Cosmic Purple',
        'particles', true,
        'effects', ARRAY['glow', 'particles']
      ),
      '[]'::jsonb,
      jsonb_build_object(
        'glowPosts', 0,
        'visionVideos', 0,
        'orbitStreams', 0,
        'totalViews', 0,
        'timeCapsules', 0,
        'communitiesJoined', 0,
        'createdContent', 0,
        'totalEngagement', 0
      ),
      false,
      0,
      0,
      0,
      NOW(),
      NOW(),
      jsonb_build_object(
        'theme', 'dark',
        'notifications', jsonb_build_object(
          'likes', true,
          'comments', true,
          'follows', true,
          'mentions', true,
          'liveStreams', true,
          'communityUpdates', true,
          'email', true,
          'push', true
        ),
        'privacy', jsonb_build_object(
          'profileVisibility', 'public',
          'showMoodStatus', true,
          'showActivity', true,
          'allowMessages', 'everyone',
          'showOnlineStatus', true
        ),
        'content', jsonb_build_object(
          'autoplay', true,
          'dataUsage', 'high',
          'contentFilter', 'all',
          'language', 'en'
        )
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new Google users
DROP TRIGGER IF EXISTS on_auth_user_created_google ON auth.users;
CREATE TRIGGER on_auth_user_created_google
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_google_user();
