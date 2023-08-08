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
import {
  getRoom,
  addRoom,
  addMemberToRoom,
  getRoomMembers,
} from "./utils/socket";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

import userRouter from "./routes/user/userRoutes";
import authRouter from "./routes/auth/authRoutes";
import { GuestUser, Room } from "./types/socket-types";

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

io.on("connection", (socket) => {
  // rooms
  socket.on("create-room", (roomId: string, data: Room, cb) => {
    // console.log(`creating room ${roomId}`);
    socket.join(roomId);
    if (!getRoom(data.id)) {
      addRoom(data);
      addMemberToRoom(roomId, {
        id: data.id,
        socketId: socket.id,
        name: data.host.name,
      });
      cb({ status: "success" });
    }
  });

  socket.on("join-room", (roomId, user: GuestUser, cb) => {
    if (getRoom(roomId)) {
      socket.join(roomId);
      addMemberToRoom(roomId, { ...user, socketId: socket.id });
      io.to(roomId).emit("room-members", getRoomMembers(roomId));

      console.log(getRoom(roomId));
      cb({ status: "success", message: "Joined room successfully" });
    } else {
      cb({ status: "failed", message: "room doesn't exist" });
    }
  });

  socket.on("get-room-members", (roomId) => {
    io.to(roomId).emit("room-members", getRoomMembers(roomId));
  });

  socket.on("get-room", (roomId, cb) => {
    const room = getRoom(roomId);
    if (room) {
      cb({ status: "success" });
    } else {
      cb({ status: "failed" });
    }
  });

  // messages
  socket.on("send-message", (roomId, data) => {
    io.to(roomId).emit("get-message", data);
  });
});

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
