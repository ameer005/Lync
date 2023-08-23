import { CbStatus, RoomUser, SocketEvents } from "../../types/socket-types";
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
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/node/lib/RtpParameters";

const webSockets = async (io: IO) => {
  io.on("connection", (socket) => {
    // ROOM EVENTS
    socket.on(
      SocketEvents.CREATE_ROOM,
      async (roomId: string, adminId: string, cb) => {
        if (roomAlreadyExist(roomId)) {
          cb({ status: CbStatus.FAILED, message: "room already exist" });
        } else {
          logger.info(`created room: ${JSON.stringify({ roomId })}`);
          let router = await getMediasoupRouter();
          addRoom(new Room(roomId, adminId, io, router));
          cb({ status: CbStatus.SUCCESS, data: { roomId: roomId } });
        }
      }
    );

    socket.on(SocketEvents.GET_ROOM, (roomId: string, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room does not exist" });
        return;
      }

      cb({ status: CbStatus.SUCCESS, roomId: roomId });
    });

    socket.on(SocketEvents.JOIN_ROOM, (roomId: string, user: RoomUser, cb) => {
      if (!roomAlreadyExist(roomId)) {
        cb({ status: CbStatus.FAILED, message: "room does not exist" });
        return;
      }

      addPeerToRoom(roomId, new Peer(socket.id, user.id, user.name));
      socket.join(roomId);
      cb({ status: CbStatus.SUCCESS, data: "successfull" });
    });

    // media soup handshake
    socket.on(
      SocketEvents.GET_ROUTER_RTP_CAPABILITIES,
      (roomId: string, cb) => {
        const room = getRoom(roomId);
        if (room) {
          cb({ status: CbStatus.SUCCESS, data: room.getRtpCapabilities() });
        } else {
          cb({ status: CbStatus.FAILED, message: "room doesn't exist" });
        }
      }
    );

    socket.on(
      SocketEvents.CREATE_WEBRTC_TRANSPORT,
      async (roomId: string, cb) => {
        const room = getRoom(roomId);

        if (!room) {
          cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
          return;
        }

        try {
          const { params } = await room?.createWebRtcTransport(socket.id);

          logger.info(
            ` webrtc transport Created ${JSON.stringify({
              name: room?.getPeers().get(socket.id)?.name,
              transportId: params.id,
            })}`
          );

          cb({ status: CbStatus.SUCCESS, data: params });
        } catch (err: any) {
          logger.error(err);
          cb({ status: CbStatus.FAILED, message: err.message });
        }
      }
    );

    socket.on(
      SocketEvents.CONNECT_TRANSPORT,
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

        try {
          await room.connectPeerTransport(
            socket.id,
            transportId,
            dtlsParameters
          );

          logger.info(
            `Transport connected ${JSON.stringify({
              name: room?.getPeers().get(socket.id)?.name,
              transportId: transportId,
            })}`
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
      SocketEvents.PRODUCE,
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

        logger.info(
          `producer created: ${JSON.stringify({
            type: kind,
            name: room.getPeers().get(socket.id)?.name,
            id: producerId,
          })}`
        );

        cb({ status: CbStatus.SUCCESS, data: { producerId } });
      }
    );

    socket.on(
      SocketEvents.CONSUME,
      async (
        roomId: string,
        consumerTransportId: string,
        producerId: string,
        rtpCapabilities: RtpCapabilities,
        cb
      ) => {
        const room = getRoom(roomId);

        if (!room) {
          cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
          return;
        }

        const res = await room.consume(
          socket.id,
          consumerTransportId,
          producerId,
          rtpCapabilities
        );

        if (!res) {
          cb({ status: CbStatus.FAILED, message: "failed to create consumer" });
          return;
        }

        logger.info(
          `consumer created: ${JSON.stringify({
            type: res?.kind,
            name: room.getPeers().get(socket.id)?.name,
            id: res?.id,
            producerId: res?.producerId,
          })}`
        );

        cb({ status: CbStatus.SUCCESS, data: res });
      }
    );

    socket.on(
      SocketEvents.RESUME_CONSUMER,
      async (roomId: string, consumerId: string, cb) => {
        try {
          const room = getRoom(roomId);

          if (!room) {
            cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
            return;
          }

          await room
            .getPeers()
            .get(socket.id)
            ?.getConsumer(consumerId)
            ?.resume();

          logger.info(`consumer resumed ${JSON.stringify({ consumerId })}`);
          cb({ status: CbStatus.SUCCESS, data: "consumer resumed" });
        } catch (err: any) {
          logger.error(
            `failed to resumer consumer: ${err.message} | ${JSON.stringify({
              consumerId,
            })}`
          );
        }
      }
    );

    socket.on(SocketEvents.LEAVE_ROOM, (roomId: string, cb) => {
      const room = getRoom(roomId);

      if (!room?.isPeerInRoom(socket.id)) {
        return;
      }

      room.removePeer(socket.id);
      socket.leave(roomId);

      if (room.getPeers().size === 0) {
        logger.info(`deleting room: ${roomId}`);
        deleteRoom(roomId);
      }
    });

    socket.on(SocketEvents.GET_PRODUCERS, (roomId: string, cb) => {
      const room = getRoom(roomId);

      if (!room) {
        cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
        return;
      }

      const proucers = room.getProducerListForPeer();
      cb({ status: CbStatus.SUCCESS, data: proucers });
    });

    socket.on(
      SocketEvents.PRODUCER_CLOSED,
      (roomId: string, producerId: string, cb) => {
        const room = getRoom(roomId);

        if (!room) {
          cb({ status: CbStatus.FAILED, message: "Room doesn't exit" });
          return;
        }

        logger.info(
          `producer close ${JSON.stringify({
            name: room.getPeers().get(socket.id)?.name,
            producerId: room
              .getPeers()
              .get(socket.id)
              ?.producers.get(producerId)?.id,
          })}`
        );

        room.closeProducer(socket.id, producerId);
        cb({ status: CbStatus.SUCCESS, data: "Producer close" });
      }
    );

    // socket.on("send-message", (roomId, data) => {
    //   io.to(roomId).emit("get-message", data);
    // });

    socket.on("disconnect", () => {});
  });
};

export { webSockets };
