import {
  Transport,
  AppData,
  RtpCapabilities,
  Device,
  TransportOptions,
  ProducerOptions,
  Producer,
  ConsumerOptions,
} from "mediasoup-client/lib/types";
import { asyncSocket } from "@/utils/helpers";
import { Socket } from "socket.io-client";
import { MeetingSlice, LocalMedia } from "@/store/slices/meetingSlice";

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

interface ProducerProps {
  localMedia: LocalMedia;
  producerTransport: Transport<AppData> | null;
  producers: Map<string, Producer<AppData>>;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
}

interface GetconsumerStreamProps extends BaseWebrtc {
  mediasoupDevice: Device;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  consumerTransport: Transport<AppData> | null;
  producerId: string;
}

// functions
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

        // console.log(message);
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
        //localVideo.srcObject = stream
        break;

      case "failed":
        console.log("tranport closed");
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
        console.log("tranport closed");
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
  producers,
  setMeetingData,
}: ProducerProps) => {
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
    console.log("yo");
    return;
  }

  const producer = await producerTransport.produce(params);
  setMeetingData({ producers: { ...producers, [producer.id]: producer } });

  producer.on("trackended", () => {
    console.log("track ended");
  });

  producer.on("transportclose", () => {
    console.log("transport ended");
  });
};

export const getconsumerStream = async ({
  producerId,
  consumerTransport,
  mediasoupDevice,
  roomId,
  setMeetingData,
  socket,
}: GetconsumerStreamProps) => {
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

    const consumer = await consumerTransport?.consume(data);
    const stream = new MediaStream();
    if (consumer) {
      stream.addTrack(consumer.track);
    }

    return {
      consumer,
      stream,
      kind: data.kind,
    };
  } catch (err: any) {
    console.error(err);
  }
};
