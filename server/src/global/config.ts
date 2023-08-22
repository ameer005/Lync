import { WorkerLogTag } from "mediasoup/node/lib/types";
import { RtpCodecCapability } from "mediasoup/node/lib/RtpParameters";
import { TransportListenIp } from "mediasoup/node/lib/Transport";
import os from "os";

export const config = {
  domain: process.env.DOMAIN || "localhost",
  https: {
    listenIp: "0.0.0.0",
    listenPort: Number(process.env.PROTOO_LISTEN_PORT) || 5000,
    isProduction: process.env.NODE_ENV === "production",
  },

  mediasoup: {
    numWorkers: Object.keys(os.cpus()).length,
    worker: {
      logLevel: "debug",
      logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"] as WorkerLogTag[],
      rtcMinPort: Number(process.env.MEDIASOUP_MIN_PORT) || 40000,
      rtcMaxPort: Number(process.env.MEDIASOUP_MAX_PORT) || 49999,
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
        {
          kind: "video",
          mimeType: "video/VP9",
          clockRate: 90000,
          parameters: {
            "profile-id": 2,
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "4d0032",
            "level-asymmetry-allowed": 1,
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/h264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
            "level-asymmetry-allowed": 1,
            "x-google-start-bitrate": 1000,
          },
        },
      ] as RtpCodecCapability[],
    },

    webRtcTransportOptions: {
      listenIps: [
        {
          ip: "0.0.0.0", //process.env.MEDIASOUP_LISTEN_IP ||
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || "127.0.0.1",
        },
      ] as TransportListenIp[],
      initialAvailableOutgoingBitrate: 1000000,
      maxIncomingBitrate: 15000000,
    },
  },
} as const;
