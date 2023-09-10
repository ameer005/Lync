import express from "express";
import {
  login,
  refresh,
  logout,
  check,
} from "../../controllers/auth/authController";
import { authenticationMiddleware } from "../../middleware/auth/auth";

const router = express.Router();

router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logout").post(authenticationMiddleware, logout);
router.route("/check").post(authenticationMiddleware, check);

export default router;
