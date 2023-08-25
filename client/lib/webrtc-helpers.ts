import {
  Transport,
  AppData,
  RtpCapabilities,
  Device,
  TransportOptions,
  ProducerOptions,
  Producer,
  ConsumerOptions,
  Consumer,
} from "mediasoup-client/lib/types";
import { asyncSocket } from "@/utils/helpers";
import { Socket } from "socket.io-client";
import {
  MeetingSlice,
  LocalMedia,
  ConsumerData,
  Peer,
} from "@/store/slices/meetingSlice";
import { RemoteProducer } from "@/types/shared";

interface BaseWebrtc {
  roomId: string;
  socket: Socket;
}

// types
interface LoadDeviceProps {
  mediasoupDevice: Device;
  rtpCapabilities: RtpCapabilities;
}

interface InitTransportProps extends BaseWebrtc {
  mediasoupDevice: Device;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
}

interface InitProducerTransportEventsProps extends BaseWebrtc {
  producerTransport: Transport<AppData>;
}

interface InitConsumerTransportEventsProps extends BaseWebrtc {
  consumerTransport: Transport<AppData>;
}

interface ProduceProps extends BaseWebrtc {
  localMedia: LocalMedia;
  producerTransport: Transport<AppData> | null;
  updateProducers: (data: { key: string; value?: Producer<AppData> }) => void;
}

interface Consume extends BaseWebrtc {
  mediasoupDevice: Device;
  consumerTransport: Transport<AppData> | null;
  remoteProducer: RemoteProducer;
  updateConsumers: (data: { key: string; value?: ConsumerData }) => void;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  peers: Map<string, Peer>;
}

interface CloseProducerProps extends BaseWebrtc {
  producer: Producer<AppData>;
}

interface AddConsumer {
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  updateConsumers: (data: { key: string; value?: ConsumerData }) => void;
  peers: Map<string, Peer>;
  consumer: Consumer<AppData>;
  user: {
    name: string;
    socketId: string;
    id: string;
  };
}

// ********************************************** FUNCTIONS ***************************************************************//
const closeProducer = async ({
  producer,
  roomId,
  socket,
}: CloseProducerProps) => {
  asyncSocket(socket, "producer-closed", roomId, producer.id);
};

// TODO make add consumer method
// TODO get already existing members and try to find an appropriate place to call them
const addConsumer = ({
  setMeetingData,
  updateConsumers,
  peers,
  user,
  consumer,
}: AddConsumer) => {
  // chedck if peer already exist
  // if it exist then add new comsumer to the consumers array inside peers
  if (peers.has(user.id)) {
    console.log("yoooo");
    return;
  }

  // if not create new peer
  const newPeer: Peer = {
    name: user.name,
    id: user.id,
    socketId: user.socketId,
    consumers: [consumer],
  };

  const updatedPeers = new Map(peers);
  updatedPeers.set(newPeer.id, newPeer);
  setMeetingData({ peers: updatedPeers });

  // mandatory add consumer to consumers global map
  updateConsumers({ key: consumer.id, value: { consumer, user } });
};

// TODO remove consumer from both peer's consumers array and global consumer map
const removeConsumer = () => {};

// **********************************************TRANSPORT FUNCTIONS ***************************************************************//

export const initTransports = async ({
  socket,
  mediasoupDevice,
  roomId,
  setMeetingData,
}: InitTransportProps) => {
  // producer transport
  {
    try {
      const data = await asyncSocket<TransportOptions>(
        socket,
        "create-webrtc-transport",
        roomId
      );

      let producerTransport = mediasoupDevice.createSendTransport(data);
      setMeetingData({
        producerTransport: producerTransport,
      });
    } catch (err) {
      console.error("failed to create producer transport: ", err);
    }
  }

  // consumer transport
  {
    try {
      const data = await asyncSocket<TransportOptions>(
        socket,
        "create-webrtc-transport",
        roomId
      );

      let consumerTransport = mediasoupDevice.createRecvTransport(data);
      setMeetingData({ consumerTransport: consumerTransport });
    } catch (err: any) {
      console.error("failed to create consumer transport", err);
    }
  }
};

export const initProducerTransportEvents = ({
  producerTransport,
  roomId,
  socket,
}: InitProducerTransportEventsProps) => {
  // procucer transport listeners
  producerTransport.on(
    "connect",
    async ({ dtlsParameters }, callback, errback) => {
      try {
        await asyncSocket<string>(
          socket,
          "connect-transport",
          roomId,
          producerTransport.id,
          dtlsParameters
        );

        callback();
      } catch (err: any) {
        errback(err);
      }
    }
  );

  producerTransport.on(
    "produce",
    async ({ kind, rtpParameters }, callback, errorback) => {
      try {
        const { producerId } = await asyncSocket<{ producerId: string }>(
          socket,
          "produce",
          roomId,
          kind,
          rtpParameters,
          producerTransport.id
        );

        console.info(`produce event: ${producerId}`);

        callback({ id: producerId });
      } catch (err: any) {
        errorback(err);
      }
    }
  );

  producerTransport.on("connectionstatechange", (state) => {
    switch (state) {
      case "connecting":
        break;

      case "connected":
        break;

      case "failed":
        producerTransport.close();
        break;

      default:
        break;
    }
  });
};

export const initConsumerTransportEvents = ({
  consumerTransport,
  roomId,
  socket,
}: InitConsumerTransportEventsProps) => {
  consumerTransport.on(
    "connect",
    async ({ dtlsParameters }, callback, errback) => {
      try {
        const message = await asyncSocket<string>(
          socket,
          "connect-transport",
          roomId,
          consumerTransport.id,
          dtlsParameters
        );

        console.log(message);
        callback();
      } catch (err: any) {
        errback(err);
      }
    }
  );

  consumerTransport.on("connectionstatechange", async (state) => {
    switch (state) {
      case "connecting":
        break;

      case "connected":
        //localVideo.srcObject = stream
        break;

      case "failed":
        consumerTransport.close();
        break;

      default:
        break;
    }
  });
};

// **************************** MAIN FUNCTIONS ****************************** //
export const produce = async ({
  localMedia,
  producerTransport,
  updateProducers,
  socket,
  roomId,
}: ProduceProps) => {
  const params: ProducerOptions = {
    track: localMedia.videoTrack!,
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 },
  };

  if (!producerTransport) {
    return;
  }

  const producer = await producerTransport.produce(params);

  updateProducers({ key: producer.id, value: producer });

  producer.on("trackended", () => {
    console.log("track ended");
    closeProducer({ socket, roomId, producer });
  });

  producer.on("transportclose", () => {
    console.log("producer transport close");
    localMedia.mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    updateProducers({ key: producer.id });
  });

  producer.on("@close", () => {
    console.log("producer transport close");
    localMedia.mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    closeProducer({ socket, roomId, producer });
    updateProducers({ key: producer.id });
  });
};

export const consume = async ({
  socket,
  mediasoupDevice,
  consumerTransport,
  roomId,
  remoteProducer,
  updateConsumers,
  peers,
  setMeetingData,
}: Consume) => {
  const { user, producers } = remoteProducer;

  if (!consumerTransport) {
    console.error("consumer transport is null");
    return;
  }

  producers.forEach(async (producerId) => {
    try {
      const { rtpCapabilities } = mediasoupDevice;

      const data = await asyncSocket<ConsumerOptions>(
        socket,
        "consume",
        roomId,
        consumerTransport?.id,
        producerId,
        rtpCapabilities
      );

      if (!consumerTransport) return;

      // store this consumer to global state
      const consumer = await consumerTransport.consume({
        id: data.id,
        producerId,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
      });

      // resuming consumer
      await asyncSocket<string>(socket, "resume-consumer", roomId, consumer.id);

      // updateConsumers({ key: consumer.id, value: { consumer, user } });
      addConsumer({ consumer, peers, setMeetingData, updateConsumers, user });

      consumer.on("trackended", () => {
        console.log("consumer track ended");
      });

      consumer.on("transportclose", () => {
        console.log("consumer transport close");
      });
    } catch (err: any) {
      console.error(err);
    }
  });
};

export const loadDevice = async ({
  mediasoupDevice,
  rtpCapabilities,
}: LoadDeviceProps) => {
  try {
    await mediasoupDevice.load({ routerRtpCapabilities: rtpCapabilities });
  } catch (err) {
    return err;
  }
};
