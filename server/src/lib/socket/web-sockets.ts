import { RoomUser } from "../../types/socket-types";
import { IO } from "../../types/shared";
import { getMediasoupRouter } from "../mediasoup/worker";
import Room from "./Room";
import Peer from "./Peer";
import {
  addRoom,
  roomAlreadyExist,
  addPeerToRoom,
  getRoom,
  deleteRoom,
} from "../../global/states";

// TODO convert these to map
// so it can store multiple states

const webSockets = async (io: IO) => {
  try {
    // mediasoupRouter = await createWorker();
  } catch (err) {
    throw err;
  }

  io.on("connection", (socket) => {
    // Normal events
    socket.on("create-room", async (roomId: string, adminId: string, cb) => {
      if (roomAlreadyExist(roomId)) {
        cb({ status: "failed", message: "room already exist" });
      } else {
        console.log("created room: ", { roomId });
        let router = await getMediasoupRouter();
        addRoom(new Room(roomId, adminId, io, router));
        cb({ status: "success", roomId: roomId });
      }
    });

    socket.on("get-room", (roomId, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: "failed", message: "room does not exist" });
        return;
      }

      cb({ status: "success", roomId: roomId });
    });

    socket.on("join-room", (roomId, user: RoomUser, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: "failed", message: "room does not exist" });
        return;
      }

      addPeerToRoom(roomId, new Peer(socket.id, user.id, user.name));
      cb({ status: "success", members: getRoom(roomId)?.toJson() });
    });

    socket.on("leave-room", (roomId, cb) => {
      const room = getRoom(roomId);

      if (!room?.isPeerInRoom(socket.id)) {
        // cb({ status: "failed", message: "Peer not in room" });
        return;
      }

      room.removePeer(socket.id);
      if (room.getPeers().size === 0) {
        deleteRoom(roomId);
      }
      // cb({ status: "success", message: "successfully existed room" });
    });

    // messages
    socket.on("send-message", (roomId, data) => {
      io.to(roomId).emit("get-message", data);
    });

    socket.on("disconnect", () => {});
  });
};

export { webSockets };
