import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import connect from "./db/connect";
import errorHandlerMiddleware from "./middleware/error/errorHandler";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./global/config";
import { createWorkers } from "./lib/mediasoup/worker";
import morganMiddleware from "./middleware/morganMiddleware";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", process.env.FRONTEND_URL!],
  },
});

import userRouter from "./routes/user/userRoutes";
import authRouter from "./routes/auth/authRoutes";
import { webSockets } from "./lib/socket/web-sockets";

dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );
} else {
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );
}
app.use(morganMiddleware);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This is working",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.use((req, res) => {
  res.status(400).json({
    status: "fail",
    message: "Route does not exist",
  });
});

// function for handling socket events
webSockets(io);

// handeling global errors
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connect(process.env.MONGO_URL!);
    server.listen(config.https.listenPort, () => {
      console.log(`Server is running on port ${config.https.listenPort}`);
    });

    await createWorkers();
  } catch (error) {
    console.log(error);
  }
};

start();
