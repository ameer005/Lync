type SocketResponse<T> =
  | { status: "success"; data: T }
  | { status: "failed"; message: string };

type SocketEvents =
  | "create-room"
  | "get-room"
  | "join-room"
  | "leave-room"
  | "get-router-rtp-capabilities"
  | "create-webrtc-transport"
  | "connect-transport"
  | "produce"
  | "consume"
  | "get-producers"
  | "resume-consumer"
  | "producer-closed"
  | "new-producer"
  | "toggle-media-controls";

declare module "*.mp3" {
  const src: string;
  export default src;
}
