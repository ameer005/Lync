import { UserInput } from "../models/user/user";

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
