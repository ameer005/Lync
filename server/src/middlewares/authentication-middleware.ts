import { NextFunction, Response, Request } from "express";
import { NotAuthenticatedError } from "../errors/not-authenticated-error";
import { prisma } from "../db/connect";
import { verifyAccessToken } from "../utils/token";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new NotAuthenticatedError();
  }

  const accessToken: string = authHeader.split(" ")[1];

  try {
    const { userId } = verifyAccessToken(accessToken);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotAuthenticatedError();
    }

    req.currentUser = user;
    next();
  } catch {
    throw new NotAuthenticatedError();
  }
};
