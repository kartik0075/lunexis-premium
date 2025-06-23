// lib/livekit.ts
import { LiveKitRoom } from "@livekit/components-react";
import { useToken } from "@/lib/useToken"; // custom hook or fetch token from API

// Example usage in page
<LiveKitRoom
  serverUrl="https://your-livekit-server.com"
  token={token}
  connect={true}
  video={true}
  audio={true}
/>
