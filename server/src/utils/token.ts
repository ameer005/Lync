import jwt from "jsonwebtoken";
import { JwtPayload, Cookie } from "../types/shared";
import { Response, CookieOptions } from "express";

enum TokenExpiration {
  Access = 5 * 60,
  // Access = 2 * 24 * 60 * 60,
  Refresh = 7 * 24 * 60 * 60,
}

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  // secure: isProduction,
  sameSite: "none",
  path: "/",
};

export const buildToken = (userId: string) => {
  const accessPayload: JwtPayload = { userId: userId };
  const refreshPayload: JwtPayload = { userId: userId };

  const accessToken = jwt.sign(
    accessPayload,
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: TokenExpiration.Access,
    },
  );

  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: TokenExpiration.Refresh },
  );

  return { accessToken, refreshToken };
};

export const setTokens = (res: Response, refresh?: string) => {
  if (refresh) {
    res.cookie(Cookie.RefreshToken, refresh, {
      ...defaultCookieOptions,
      maxAge: TokenExpiration.Refresh * 1000,
    });
  }
};

export const verifyRefreshToken = (refresh: string): JwtPayload => {
  return jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
};

export const verifyAccessToken = (access: string): JwtPayload => {
  return jwt.verify(access, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
};

export const clearToken = (res: Response) => {
  res.cookie(Cookie.AccessToken, "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });

  res.cookie(Cookie.RefreshToken, "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
};
