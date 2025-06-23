"use client";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return <div className="p-4">Please log in to view your dashboard.</div>;

  const stats = user.stats;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Lunexis Stats</h1>
      <ul className="space-y-2">
        <li>🌟 Glow Posts: {stats.glowPosts}</li>
        <li>👁️‍🗨️ Vision Videos: {stats.visionVideos}</li>
        <li>📡 Orbit Streams: {stats.orbitStreams}</li>
        <li>🎥 Total Views: {stats.totalViews}</li>
        <li>🕰️ Time Capsules: {stats.timeCapsules}</li>
        <li>🌐 Communities Joined: {stats.communitiesJoined}</li>
        <li>📝 Created Content: {stats.createdContent}</li>
        <li>📈 Total Engagement: {stats.totalEngagement}</li>
      </ul>
    </div>
  );
}