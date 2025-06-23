import type { NextApiRequest, NextApiResponse } from "next";
import { AccessToken } from "livekit-server-sdk";

const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const roomName = "orbit-room";
  const identity = `user-${Math.floor(Math.random() * 1000000)}`;

  const at = new AccessToken(API_KEY, API_SECRET, {
    identity,
  });
  at.addGrant({ roomJoin: true, room: roomName });

  const token = at.toJwt();
  res.status(200).send(token);
}
