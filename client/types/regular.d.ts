// interface SocketResponse<T> {
//   status: "success" | "failed";
//   data: T;
//   message?: string;
// }

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
  | "resume-consumer";
