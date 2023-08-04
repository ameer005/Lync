import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendCode = async (
  username: string,
  email: string,
  activationCode: string
) => {
  try {
    const mailOptions = {
      from: '"Lync" hello@aniro.to',
      to: email,
      subject: "Please activate your account",
      html: `<h1>Account Activation</h1>
        <h2>Hello ${username}</h2>
        <p>Thank you for signing up. Please activate your account by verifying the otp.</p>
        <h1>${activationCode}<h1>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("nodemailer error");
    console.log(err);
  }
};

export const sendForgotPasswordCode = async (
  username: string,
  email: string,
  resetPasswordCode: string
) => {
  try {
    const mailOptions = {
      from: '"Lync" hello@aniro.to',
      to: email,
      subject: "Password Reset Code",
      html: `<h1>Forgot Password</h1>
        <h2>Hello , ${username}</h2>
        <p>Your password reset code is</p>
        <h1>${resetPasswordCode}<h1>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("nodemailer error");
    console.log(err);
  }
};

export const sendNewPassword = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const mailOptions = {
      from: '"Lync" hello@aniro.to',
      to: email,
      subject: "New Password",
      html: `<h1>New Password Generate</h1>
        <h2>Hello , ${username}</h2>
        <p>Your new password is </p>
        <h1>${password}<h1>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("nodemailer error");
    console.log(err);
  }
};
