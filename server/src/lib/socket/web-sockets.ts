import {
  getRoom,
  addRoom,
  addMemberToRoom,
  getRoomMembers,
  removeMemberFromRoom,
} from "../../global/states";
import { Room, GuestUser } from "../../types/socket-types";
import { IO } from "../../types/shared";

// TODO convert these to map
// so it can store multiple states

const webSockets = async (io: IO) => {
  try {
    // mediasoupRouter = await createWorker();
  } catch (err) {
    throw err;
  }

  io.on("connection", (socket) => {
    // sending rtp capabilities to user
    // so there is no mismatch between server format and client format
    socket.on("get-router-rtp-caps", (cb) => {
      // cb({ data: mediasoupRouter.rtpCapabilities });
    });

    // creating producer transport
    socket.on("create-producer-transport", async (cb) => {
      try {
        // const { params, transport } = await createWebRtcTransport(
        //   mediasoupRouter
        // );
        // producerTransport = transport;
        // cb({ status: "success", params });
      } catch (error) {
        console.error(error);
        cb({ status: "failed", message: error });
      }
    });

    // connecting transport
    socket.on("connect-producer-transport", async (dtlsParameters, cb) => {
      // await producerTransport.connect({ dtlsParameters });
      cb({ status: "success" });
    });

    // sharing media
    // TODO do this when joining room
    socket.on("produce", async (roomId, params, cb) => {
      const { kind, rtpParameters } = params;
      // producer = await producerTransport.produce({ kind, rtpParameters });

      // notifying everyone that new memeber has joined
      socket.to(roomId).emit("new-producer", "new user");
      // cb({ status: "success", producerId: producer.id });
    });

    socket.on("create-consumer-transport", async (data, cb) => {
      try {
        // TODO store it inside global transport map
        // const { transport, params } = await createWebRtcTransport(
        //   mediasoupRouter
        // );
        // consumerTransport = transport;
        // cb({ status: "success", params });
      } catch (error) {
        cb({ status: "failed", error });
        console.error(error);
      }
    });

    socket.on("connect-consumer-transport", async (dtlsParameters, cb) => {
      // await consumerTransport.connect({ dtlsParameters });
      cb({ status: "success" });
    });

    socket.on("consume", () => {});

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
