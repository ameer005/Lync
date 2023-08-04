import { Request } from "express";
import { UserDocument } from "../models/user/user";

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
