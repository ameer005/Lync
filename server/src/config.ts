import { WorkerLogTag } from "mediasoup/node/lib/types";
import { RtpCodecCapability } from "mediasoup/node/lib/RtpParameters";
import { TransportListenIp } from "mediasoup/node/lib/Transport";
import os from "os";

export const config = {
  listenIp: "0.0.0.0",
  listenPort: 5000,

  mediasoup: {
    numWorkers: Object.keys(os.cpus()).length,
    worker: {
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
      logLevel: "debug",
      logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"] as WorkerLogTag[],
    },
  },
  router: {
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {
          "x-google-start-bitrate": 1000,
        },
      },
    ] as RtpCodecCapability[],
  },

  // web rtc transport setting
  webRtcTransport: {
    listenIps: [
      {
        ip: "0.0.0.0",
        announcedIp: "127.0.0.1", //replace with public ip if hosting
      },
    ] as TransportListenIp[],
  },
} as const;
