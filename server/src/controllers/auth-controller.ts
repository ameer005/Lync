import { Request, Response, NextFunction } from "express";
import {
  buildToken,
  setTokens,
  verifyRefreshToken,
  clearToken,
} from "../utils/token";
import { Cookie } from "../types/shared";
import { prisma } from "../db/connect";
import { NotFoundError } from "../errors/not-found-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { Password } from "../services/password";
import { NotAuthenticatedError } from "../errors/not-authenticated-error";
import { LoginInput } from "../schemas/auth-schema";

export class AuthController {
  constructor() {}

  async login(req: Request<{}, {}, LoginInput["body"]>, res: Response) {
    const { email, password } = req.body;

    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      user = await prisma.user.findUnique({ where: { username: email } });

      if (!user) {
        throw new NotFoundError("Invalid email or password");
      }
    }

    if (!user.accountActivated) {
      throw new NotAuthorizedError("Please activate your account");
    }

    const isPasswordCorrect = await Password.compare(user.password, password);

    if (!isPasswordCorrect) {
      throw new NotAuthenticatedError("Invalid email or password");
    }

    const { accessToken, refreshToken } = buildToken(user.id);

    setTokens(res, refreshToken);

    res.status(200).json({
      token: accessToken,
      user,
    });
  }

  async refresh(req: Request, res: Response) {
    const cookies = req.cookies;

    if (!cookies[Cookie.RefreshToken]) {
      throw new NotAuthenticatedError();
    }

    const refreshToken: string = cookies[Cookie.RefreshToken];

    try {
      const { userId } = verifyRefreshToken(refreshToken);

      let user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const { accessToken } = buildToken(user.id);
      // setTokens(res, accessToken);
      res.status(200).json({
        message: "success",
        token: accessToken,
        user,
      });
    } catch {
      clearToken(res);
      throw new NotAuthenticatedError();
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({});
  }
}
