import { Router } from "mediasoup/node/lib/types";
import { config } from "../../global/config";

const createWebRtcTransport = async (mediasoupRouter: Router) => {
  const { initialAvailableOutgoingBitrate, maxIncomeBitrate } =
    config.webRtcTransport;
  const transport = await mediasoupRouter.createWebRtcTransport({
    listenIps: config.webRtcTransport.listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate,
  });

  if (maxIncomeBitrate) {
    try {
      await transport.setMaxIncomingBitrate(maxIncomeBitrate);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    },
  };
};

export { createWebRtcTransport };
