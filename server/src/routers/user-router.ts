import express from "express";
import { validate } from "node-cron";
import { UserController } from "../controllers/user-controller";
import { validateReq } from "../middlewares/validate-req";
import {
  activateAccountSchema,
  forgotPasswordSchema,
  sendActivationCodeSchema,
  signupSchema,
  validateForgotPasswordSchema,
} from "../schemas/user-schema";

const router = express.Router();
const controller = new UserController();

router
  .route("/signup")
  .post(validateReq(signupSchema), controller.signup.bind(controller));
router
  .route("/activate")
  .post(
    validateReq(activateAccountSchema),
    controller.activateAccount.bind(controller),
  );
router
  .route("/sendActivationCode")
  .post(
    validateReq(sendActivationCodeSchema),
    controller.sendActivationCode.bind(controller),
  );
router
  .route("/forgotPassword")
  .post(
    validateReq(forgotPasswordSchema),
    controller.forgotPassword.bind(controller),
  );
router
  .route("/validateForgotPassword")
  .post(
    validateReq(validateForgotPasswordSchema),
    controller.validateForgotPassword.bind(controller),
  );

export { router as userRouter };
