import { Request } from "express";
import { UserDocument } from "../models/user/user";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server } from "socket.io";

export interface CustomError extends Error {
  statusCode: number;
}

export interface JwtPayload {
  userId: string;
}

export enum Cookie {
  AccessToken = "access",
  RefreshToken = "refresh",
}

export interface CustomRequest extends Request {
  user?: UserDocument;
}

export type IO = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export type Status = "success" | "failed";
