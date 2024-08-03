import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import morganMiddleware from "./middlewares/morgan-middleware";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./global/config";
import { webSockets } from "./lib/socket/web-sockets";
import { errorHandler } from "./middlewares/error-handler";

import { userRouter } from "./routers/user-router";
import { authRouter } from "./routers/auth-router";
import { MethodNotAllowedError } from "./errors/method-not-allowed";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.https.isProduction
      ? [process.env.FRONTEND_URL!]
      : ["http://localhost:3000"],
  },
});

app.use(
  cors({
    credentials: true,
    origin: config.https.isProduction ? [process.env.FRONTEND_URL!] : true,
  }),
);

app.use(morganMiddleware);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());
app.use(mongoSanitize());

app.get("/", (_, res) => {
  res.status(200).json({
    status: "success",
    message: "This is working",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.use((_, res) => {
  throw new MethodNotAllowedError();
});

webSockets(io);

app.use(errorHandler);

export { server as app };
