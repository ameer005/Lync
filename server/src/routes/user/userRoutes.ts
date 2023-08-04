import express from "express";
import {
  activateAccount,
  sendActivationCode,
  signup,
  forgotPassword,
  validateForgotPassword,
} from "../../controllers/user/userController";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/activate").post(activateAccount);
router.route("/sendActivationCode").post(sendActivationCode);
router.route("/forgotPassword").post(forgotPassword);
router.route("/validateForgotPassword").post(validateForgotPassword);

export default router;
