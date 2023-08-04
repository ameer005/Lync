import { Request, Response, NextFunction } from "express";

import User from "../../models/user/user";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import generateOTP from "../../utils/generateOTP";
import { sendCode, sendForgotPasswordCode } from "../../utils/email";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, password, email } = req.body;

    if (!name || !username || !password || !email) {
      return next(new AppError("Please provide all vlaues.", 400));
    }
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return next(new AppError("User already exist", 400));
    }

    const isUsernameTaken = await User.findOne({ username });
    if (isUsernameTaken) {
      return next(new AppError("Please choose different username", 400));
    }

    const otp = generateOTP(6);
    const user = await User.create({
      email,
      username: username.toLowerCase(),
      password,
      activationCode: otp,
      name,
    });

    sendCode(user.username, user.email, user.activationCode);

    res.status(201).json({
      email: user.email,
    });
  }
);

export const activateAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, email } = req.body;

    if (!code || !email) {
      return next(new AppError("Please provide all values", 400));
    }

    const user = await User.findOne({ activationCode: code, email });

    if (!user) {
      return next(new AppError("Please provide a valid code", 400));
    }

    user.accountActivated = true;
    user.activationCode = "";
    await user.save();

    res.status(200).json({
      message: "Account successfully activated",
    });
  }
);

export const sendActivationCode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide email", 400));
    }

    const user = await User.findOne({ email }).select("+activationCode");

    if (!user) {
      return next(new AppError("No user found", 400));
    }

    const code = generateOTP(6);

    user.activationCode = code;
    await user.save();

    sendCode(user.username, user.email, code);

    res.status(200).json({});
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide email", 400));
    }

    const user = await User.findOne({ email }).select("+resetPasswordCode");

    if (!user) {
      return next(new AppError("No user found", 400));
    }

    const code = generateOTP(6);
    user.resetPasswordCode = code;
    await user.save();

    sendForgotPasswordCode(user.username, user.email, code);

    res.status(200).json({
      status: "success",
      message:
        "otp has been successfully sent to your registered email account",
    });
  }
);

export const validateForgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, newPassword, email } = req.body;

    if (!code || !newPassword) {
      return next(new AppError("Please provide all values", 400));
    }

    const user = await User.findOne({ email: email }).select(
      "+resetPasswordCode"
    );

    if (!user) {
      return next(new AppError("Please provide valid verification code", 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Your password has been changed successfully",
    });
  }
);
