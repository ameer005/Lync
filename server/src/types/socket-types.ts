import { Transport } from "mediasoup/node/lib/Transport";
import { Consumer } from "mediasoup/node/lib/Consumer";
import { Producer } from "mediasoup/node/lib/Producer";

export interface RoomUser {
  name: string;
  id: string;
}

export interface Peer {
  socketId: string;
  id: string;
  name: string;
  transports: Map<string, Transport>;
  consumers: Map<string, Consumer>;
  producers: Map<string, Producer>;
}

export enum CbStatus {
  FAILED = "failed",
  SUCCESS = "success",
}

export enum SocketEvents {
  CREATE_ROOM = "create-room",
  GET_ROOM = "get-room",
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  GET_ROUTER_RTP_CAPABILITIES = "get-router-rtp-capabilities",
  CREATE_WEBRTC_TRANSPORT = "create-webrtc-transport",
  CONNECT_TRANSPORT = "connect-transport",
  PRODUCE = "produce",
  CONSUME = "consume",
  NEW_PRODUCER = "new-producer",
  CONSUMER_CLOSED = "consumer-closed",
  RESUME_CONSUMER = "resume-consumer",
  GET_PRODUCERS = "get-producers",
  PRODUCER_CLOSED = "producer-closed",
  TOGGLE_MEDIA_CONTROLS = "toggle-media-controls",
  LISTEN_MEDIA_TOGGLE = "listen-media-toggle",
}
