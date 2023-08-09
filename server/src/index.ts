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

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

import userRouter from "./routes/user/userRoutes";
import authRouter from "./routes/auth/authRoutes";
import { webSockets } from "./lib/web-sockets";

dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
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

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connect(process.env.MONGO_URL!);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
