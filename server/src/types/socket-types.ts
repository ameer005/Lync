import { Transport } from "mediasoup/node/lib/Transport";
import { UserInput } from "../models/user/user";
import { Consumer } from "mediasoup/node/lib/Consumer";
import { Producer } from "mediasoup/node/lib/Producer";

export interface SocketUser extends UserInput {
  socketId: string;
}

export interface GuestUser {
  socketId: string;
  name: string;
  id: string;
}

export interface Room {
  host: SocketUser;
  id: string;
  members: GuestUser[];
}

// trying new
export interface Peer {
  socketId: string;
  id: string;
  name: string;
  transports: Map<string, Transport>;
  consumers: Map<string, Consumer>;
  producers: Map<string, Producer>;
}
