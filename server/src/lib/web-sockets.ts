import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Server } from "socket.io";
import {
  getRoom,
  addRoom,
  addMemberToRoom,
  getRoomMembers,
  removeMemberFromRoom,
} from "../utils/socket";
import { Room, GuestUser } from "../types/socket-types";
import { createWorker } from "./worker";
import { Router } from "mediasoup/node/lib/types";

let mediasoupRouter: Router;

const webSockets = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  try {
    mediasoupRouter = await createWorker();
  } catch (err) {
    throw err;
  }

  io.on("connection", (socket) => {
    // Mediasoup Events
    socket.on("get-router-rtp-caps", (cb) => {
      cb({ data: mediasoupRouter.rtpCapabilities });
    });

    // Normal events
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

        // console.log(getRoom(roomId));
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

    socket.on("leave-room", (roomId) => {
      // console.log("YOOO LEAVING ROOM");
      removeMemberFromRoom(roomId, socket.id);
      // console.log(getRoom(roomId));
    });

    // messages
    socket.on("send-message", (roomId, data) => {
      io.to(roomId).emit("get-message", data);
    });

    socket.on("disconnect", () => {});
  });
};

export { webSockets };
