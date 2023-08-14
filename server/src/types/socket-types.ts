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
