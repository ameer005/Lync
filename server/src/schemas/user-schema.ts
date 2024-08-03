import { object, string, TypeOf } from "zod";

export const signupSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    username: string({ required_error: "Username is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email",
    ),
    password: string({ required_error: "Password is required" }),
  }),
});

export const activateAccountSchema = object({
  body: object({
    code: string({ required_error: "OTP is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email",
    ),
  }),
});

export const sendActivationCodeSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email",
    ),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email",
    ),
  }),
});

export const validateForgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email",
    ),
    code: string({ required_error: "OTP is required" }),
    newPassword: string({ required_error: "New password is required." }),
  }),
});

export type SignupInput = TypeOf<typeof signupSchema>;
export type ActivateAccountInput = TypeOf<typeof activateAccountSchema>;
export type SendActivationCodeInput = TypeOf<typeof sendActivationCodeSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type ValidateForgotPasswordInput = TypeOf<
  typeof validateForgotPasswordSchema
>;
