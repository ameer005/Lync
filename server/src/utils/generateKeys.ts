import crypto from "crypto";

const jwtSecret = crypto.randomBytes(32).toString("hex");
const accessToken = crypto.randomBytes(32).toString("hex");
const refreshToken = crypto.randomBytes(32).toString("hex");

console.table({ jwtSecret, accessToken, refreshToken });
