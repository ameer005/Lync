import express from "express";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { AuthController } from "../controllers/auth-controller";
import { validateReq } from "../middlewares/validate-req";
import { loginSchema } from "../schemas/auth-schema";

const router = express.Router();
const controller = new AuthController();

router
  .route("/login")
  .post(validateReq(loginSchema), controller.login.bind(controller));
router.route("/refresh").get(controller.refresh.bind(controller));
router.route("/logout").post(authenticationMiddleware);
router
  .route("/check")
  .post(authenticationMiddleware, controller.check.bind(controller));

export { router as authRouter };
