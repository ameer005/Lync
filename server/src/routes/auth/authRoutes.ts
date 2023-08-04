import express from "express";
import { login, refresh, logout } from "../../controllers/auth/authController";
import { authenticationMiddleware } from "../../middleware/auth/auth";

const router = express.Router();

router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logout").post(authenticationMiddleware, logout);

export default router;
