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
import { DtlsParameters } from "mediasoup/node/lib/WebRtcTransport";
import { MediaKind, RtpParameters } from "mediasoup/node/lib/RtpParameters";

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

    socket.on("get-room", (roomId: string, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room does not exist" });
        return;
      }

      cb({ status: CbStatus.SUCCESS, roomId: roomId });
    });

    socket.on("join-room", (roomId: string, user: RoomUser, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room does not exist" });
        return;
      }

      addPeerToRoom(roomId, new Peer(socket.id, user.id, user.name));
      cb({ status: CbStatus.SUCCESS, data: getRoom(roomId)?.toJson() });
    });

    socket.on("leave-room", (roomId: string, cb) => {
      const room = getRoom(roomId);

      // TODO not working properly
      if (!room?.isPeerInRoom(socket.id)) {
        return;
      }

      room.removePeer(socket.id);

      if (room.getPeers().size === 0) {
        logger.info(`deleting room: ${roomId}`);
        deleteRoom(roomId);
      }
    });

    // media soup handshake
    socket.on("get-router-rtp-capabilities", (roomId: string, cb) => {
      const room = getRoom(roomId);
      if (room) {
        cb({ status: CbStatus.SUCCESS, data: room.getRtpCapabilities() });
      } else {
        cb({ status: CbStatus.FAILED, message: "room doesn't exist" });
      }
    });

    socket.on("create-webrtc-transport", async (roomId: string, cb) => {
      const room = getRoom(roomId);

      if (!room) {
        cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
        return;
      }

      logger.info(
        `Creating webrtc transport for ${JSON.stringify({
          name: room?.getPeers().get(socket.id)?.name,
        })}`
      );

      try {
        const { params } = await room?.createWebRtcTransport(socket.id);

        cb({ status: CbStatus.SUCCESS, data: params });
      } catch (err: any) {
        logger.error(err);
        cb({ status: CbStatus.FAILED, message: err.message });
      }
    });

    socket.on(
      "connect-transport",
      async (
        roomId: string,
        transportId: string,
        dtlsParameters: DtlsParameters,
        cb
      ) => {
        const room = getRoom(roomId);

        if (!room) {
          cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
          return;
        }

        logger.info(
          `Connecting  transport for ${JSON.stringify({
            name: room?.getPeers().get(socket.id),
          })}`
        );

        try {
          await room.connectPeerTransport(
            socket.id,
            transportId,
            dtlsParameters
          );

          cb({
            status: CbStatus.SUCCESS,
            data: "tranport successfully connected",
          });
        } catch (err: any) {
          logger.error(err);
          cb({ status: CbStatus.FAILED, message: err.message });
        }
      }
    );

    socket.on(
      "produce",
      async (
        roomId: string,
        kind: MediaKind,
        rtpParameters: RtpParameters,
        producerTransportId: string,
        cb
      ) => {
        const room = getRoom(roomId);

        if (!room) {
          cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
          return;
        }

        let producerId = await room.produce(
          socket.id,
          producerTransportId,
          rtpParameters,
          kind
        );

        console.info(
          `producer created: ${JSON.stringify({
            type: kind,
            name: room.getPeers().get(socket.id)?.name,
            id: producerId,
          })}`
        );

        cb({ status: CbStatus.SUCCESS, data: { producerId } });
      }
    );

    // socket.on("send-message", (roomId, data) => {
    //   io.to(roomId).emit("get-message", data);
    // });

    socket.on("disconnect", () => {});
  });
};

export { webSockets };
