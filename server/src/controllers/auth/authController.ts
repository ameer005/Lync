import { Request, Response, NextFunction } from "express";
import User from "../../models/user/user";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import {
  buildToken,
  setTokens,
  verifyRefreshToken,
  clearToken,
} from "../../utils/token";
import { Cookie } from "../../types/shared";

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("please provide all values", 400));
    }

    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    }).select("+password +accountActivated");

    if (!user) {
      return next(new AppError("Invalid email or password", 404));
    }

    if (!user.accountActivated) {
      return next(new AppError("Please activate your account", 403));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(new AppError("Invalid email or password", 401));
    }

    const { accessToken, refreshToken } = buildToken(user._id);

    setTokens(res, refreshToken);
    user.password = undefined;
    user.accountActivated = undefined;

    res.status(200).json({
      token: accessToken,
      user,
    });
  }
);

export const refresh = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;

    if (!cookies[Cookie.RefreshToken]) {
      return next(new AppError("Authentication failed", 401));
    }

    const refreshToken: string = cookies[Cookie.RefreshToken];

    try {
      const { userId } = verifyRefreshToken(refreshToken);

      const user = await User.findById(userId);

      if (!user) {
        return next(new AppError("No user found with this id", 400));
      }

      const { accessToken } = buildToken(user._id);
      // setTokens(res, accessToken);
      res.status(200).json({
        message: "success",
        token: accessToken,
        user,
      });
    } catch {
      clearToken(res);
      return next(new AppError("Authentication failed", 401));
    }
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearToken(res);
    res.status(200).json({});
  }
);
