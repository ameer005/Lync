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
      logTags: [
        "info",
        "ice",
        "dtls",
        "rtp",
        "srtp",
        "rtcp",
        "rtx",
        "bwe",
        "score",
        "simulcast",
        "svc",
        "sctp",
      ] as WorkerLogTag[],
      rtcMinPort: Number(process.env.MEDIASOUP_MIN_PORT) || 10000,
      rtcMaxPort: Number(process.env.MEDIASOUP_MAX_PORT) || 10100,
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

    webRtcServerOptions: {
      listenInfos: [
        {
          protocol: "udp",
          ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
          port: 44444,
        },
        {
          protocol: "tcp",
          ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
          port: 44444,
        },
      ],
    },

    webRtcTransportOptions: {
      listenIps: [
        {
          ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
        },
      ] as TransportListenIp[],
      initialAvailableOutgoingBitrate: 1000000,
      minimumAvailableOutgoingBitrate: 600000,
      maxSctpMessageSize: 262144,
      maxIncomingBitrate: 1500000,
    },

    plainTransportOptions: {
      listenIp: {
        ip: process.env.MEDIASOUP_LISTEN_IP || "0.0.0.0",
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
      },
      maxSctpMessageSize: 262144,
    },
  },
} as const;
