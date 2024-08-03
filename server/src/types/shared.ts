import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server } from "socket.io";

export interface JwtPayload {
  userId: string;
}

export enum Cookie {
  AccessToken = "access",
  RefreshToken = "refresh",
}

export type IO = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export type Status = "success" | "failed";
