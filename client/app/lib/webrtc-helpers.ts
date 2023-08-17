import {
  Transport,
  AppData,
  RtpCapabilities,
  Device,
  TransportOptions,
} from "mediasoup-client/lib/types";
import { asyncSocket } from "@/utils/helpers";
import { Socket } from "socket.io-client";
import { MeetingSlice } from "@/store/slices/meetingSlice";

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

export const initTransports = async ({
  socket,
  mediasoupDevice,
  roomId,
  setMeetingData,
}: InitTransportProps) => {
  try {
    const data = await asyncSocket<TransportOptions>(
      socket,
      "create-webrtc-transport",
      roomId
    );

    let proTransport = mediasoupDevice.createSendTransport(data);
    setMeetingData({
      producerTransport: proTransport,
    });
  } catch (err) {
    console.error(err);
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
        const message = await asyncSocket<string>(
          socket,
          "connect-transport",
          roomId,
          producerTransport.id,
          dtlsParameters
        );

        console.log(message);
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

        console.log(producerId);

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
