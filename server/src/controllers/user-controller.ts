import { Request, Response, NextFunction } from "express";

import generateOTP from "../utils/generateOTP";
import { sendCode, sendForgotPasswordCode } from "../utils/email";
import {
  ActivateAccountInput,
  ForgotPasswordInput,
  SendActivationCodeInput,
  SignupInput,
  ValidateForgotPasswordInput,
} from "../schemas/user-schema";
import { prisma } from "../db/connect";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import { NotFoundError } from "../errors/not-found-error";

export class UserController {
  constructor() {}

  async signup(req: Request<{}, {}, SignupInput["body"]>, res: Response) {
    const { name, username, password, email } = req.body;

    const isUserExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isUserExist) {
      throw new BadRequestError("User already exist");
    }

    const isUsernameTaken = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
    if (isUsernameTaken) {
      throw new BadRequestError(
        "Username already taken. Please use different one",
      );
    }

    const hashedPassword = await Password.toHash(password);

    const otp = generateOTP(6);
    const user = await prisma.user.create({
      data: {
        email,
        username: username.toLowerCase(),
        password: hashedPassword,
        activationCode: otp,
        name,
        adminAccess: false,
        accountActivated: false,
      },
    });

    sendCode(user.username, user.email, user.activationCode!);

    res.status(201).json({
      email: user.email,
    });
  }

  async activateAccount(
    req: Request<{}, {}, ActivateAccountInput["body"]>,
    res: Response,
  ) {
    const { code, email } = req.body;

    const user = await prisma.user.findUnique({
      where: { activationCode: code, email },
    });

    if (!user) {
      throw new NotFoundError("User doesn't exist");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { accountActivated: true, activationCode: "" },
    });

    res.status(200).json({
      message: "Account successfully activated",
    });
  }

  async sendActivationCode(
    req: Request<{}, {}, SendActivationCodeInput["body"]>,
    res: Response,
  ) {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError("User doesn't exist");
    }

    const code = generateOTP(6);

    await prisma.user.update({
      where: { id: user.id },
      data: { activationCode: code },
    });

    sendCode(user.username, user.email, code);

    res.status(200).json({});
  }

  async forgotPassword(
    req: Request<{}, {}, ForgotPasswordInput["body"]>,
    res: Response,
  ) {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError("User doesn't exist");
    }

    const code = generateOTP(6);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordCode: code },
    });

    sendForgotPasswordCode(user.username, user.email, code);

    res.status(200).json({
      status: "success",
      message:
        "otp has been successfully sent to your registered email account",
    });
  }

  async validateForgotPassword(
    req: Request<{}, {}, ValidateForgotPasswordInput["body"]>,
    res: Response,
  ) {
    const { code, newPassword, email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email, resetPasswordCode: code },
    });

    if (!user) {
      throw new NotFoundError("User doesn't exist");
    }

    let hashedPass = await Password.toHash(newPassword);

    user.password = newPassword;
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPass },
    });

    res.status(200).json({
      status: "success",
      message: "Your password has been changed successfully",
    });
  }
}
