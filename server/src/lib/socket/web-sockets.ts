import { CbStatus, RoomUser } from "../../types/socket-types";
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
import logger from "../logger";

const webSockets = async (io: IO) => {
  io.on("connection", (socket) => {
    // ROOM EVENTS
    socket.on("create-room", async (roomId: string, adminId: string, cb) => {
      if (roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room already exist" });
      } else {
        logger.info(`created room: ${JSON.stringify({ roomId })}`);
        let router = await getMediasoupRouter();
        addRoom(new Room(roomId, adminId, io, router));
        cb({ status: CbStatus.SUCCESS, data: { roomId: roomId } });
      }
    });

    socket.on("get-room", (roomId, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room does not exist" });
        return;
      }

      cb({ status: CbStatus.SUCCESS, roomId: roomId });
    });

    socket.on("join-room", (roomId, user: RoomUser, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room does not exist" });
        return;
      }

      addPeerToRoom(roomId, new Peer(socket.id, user.id, user.name));
      cb({ status: CbStatus.SUCCESS, data: getRoom(roomId)?.toJson() });
    });

    socket.on("leave-room", (roomId, cb) => {
      const room = getRoom(roomId);

      // TODO not working properly
      if (!room?.isPeerInRoom(socket.id)) {
        console.log("nooo");
        return;
      }

      room.removePeer(socket.id);

      console.log(room.getPeers().size);
      if (room.getPeers().size === 0) {
        logger.info(`deleting room: ${roomId}`);
        deleteRoom(roomId);
      }
    });

    // media soup handshake
    socket.on("get-router-rtp-capabilities", (roomId, cb) => {
      const room = getRoom(roomId);
      if (room) {
        cb({ status: CbStatus.SUCCESS, data: room.getRtpCapabilities() });
      } else {
        cb({ status: CbStatus.FAILED, message: "room doesn't exist" });
      }
    });

    // socket.on("send-message", (roomId, data) => {
    //   io.to(roomId).emit("get-message", data);
    // });

    socket.on("disconnect", () => {});
  });
};

export { webSockets };
