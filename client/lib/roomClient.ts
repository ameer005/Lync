import useStore from "@/store/useStore";
import * as mediasoup from "mediasoup-client";
import {
  Transport,
  AppData,
  Producer,
  RtpCapabilities,
  TransportOptions,
  ProducerOptions,
  ConsumerOptions,
  Consumer,
} from "mediasoup-client/lib/types";
import { ConsumerData, Peer, RemoteProducer } from "@/types/room-types";
import { asyncSocket } from "@/utils/helpers";

class RoomClient {
  roomId: string;
  setState = useStore.setState;
  socket = useStore.getState().socket;
  mediasoupDevice = new mediasoup.Device();
  producerTransport: Transport<AppData> | null = null;
  consumerTransport: Transport<AppData> | null = null;
  producers: Map<string, Producer<AppData>> = new Map();
  consumers: Map<string, ConsumerData> = new Map();
  remoteProducersIds: Map<string, null> = new Map();

  sharingScreen: boolean = false;

  constructor(roomId: string) {
    this.roomId = roomId;

    this.listenSocketEvents();
  }

  listenSocketEvents() {
    this.socket.on("new-producer", (data: RemoteProducer) => {
      this.consume({ remoteProducer: data });
    });

    this.socket.on("consumer-closed", (id: string) => {
      this.removeConsumer(id);
    });
  }

  async joinRoom(payload: { name: string; id: string }) {
    await this.loadDevice(payload);
    await this.initTransports();
    await this.produce("video");
    await this.produce("audio");
  }

  async produce(type: "audio" | "video" | "screen-audio" | "screen-video") {
    const { localMedia, localMediaScreen } = useStore.getState();
    let params: ProducerOptions;

    if (type === "video") {
      params = {
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
    } else if (type === "audio") {
      params = {
        track: localMedia.audioTrack!,
      };
    } else if (type === "screen-video") {
      params = {
        track: localMediaScreen.videoTrack!,
      };
    } else {
      params = {
        track: localMediaScreen.audioTrack!,
      };
    }

    if (!this.producerTransport) {
      return;
    }

    const producer = await this.producerTransport.produce(params);

    this.producers.set(producer.id, producer);

    producer.on("trackended", () => {
      console.log("track ended");
      this.closeProducer(producer.id);
    });

    producer.on("transportclose", () => {
      console.log("producer transport close");
      localMedia.mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });

      this.producers.delete(producer.id);
    });

    producer.on("@close", () => {
      console.log("producer transport close");
      localMedia.mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });

      this.closeProducer(producer.id);
      this.producers.delete(producer.id);
    });
  }

  async consume({ remoteProducer }: { remoteProducer: RemoteProducer }) {
    const { user, producers } = remoteProducer;

    if (!this.consumerTransport) {
      console.error("consumer transport is null");
      return;
    }

    producers.forEach(async (producerId) => {
      if (this.remoteProducersIds.has(producerId)) {
        return;
      }
      this.remoteProducersIds.set(producerId, null);
      try {
        const { rtpCapabilities } = this.mediasoupDevice;

        const data = await asyncSocket<ConsumerOptions>(
          this.socket,
          "consume",
          this.roomId,
          this.consumerTransport?.id,
          producerId,
          rtpCapabilities
        );

        if (!this.consumerTransport) return;

        // store this consumer to global state
        const consumer = await this.consumerTransport.consume({
          id: data.id,
          producerId,
          kind: data.kind,
          rtpParameters: data.rtpParameters,
        });

        // resuming consumer
        await asyncSocket<string>(
          this.socket,
          "resume-consumer",
          this.roomId,
          consumer.id
        );

        // updateConsumers({ key: consumer.id, value: { consumer, user } });
        this.addConsumer({ consumer, user });

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
  }

  // helpers
  async loadDevice(payload: { name: string; id: string }) {
    await asyncSocket<any>(this.socket, "join-room", this.roomId, payload);
    const rtpCapabilities = await asyncSocket<RtpCapabilities>(
      this.socket,
      "get-router-rtp-capabilities",
      this.roomId
    );

    await this.mediasoupDevice.load({ routerRtpCapabilities: rtpCapabilities });
  }

  async startLocalStream() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 400, max: 1080 },
        },
      });

      const audioTrack = mediaStream.getAudioTracks()[0];
      const videoTrack = mediaStream.getVideoTracks()[0];

      this.setState({
        localMedia: {
          audioTrack,
          mediaStream,
          videoTrack,
        },
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }

  initTransports = async () => {
    // producer transport
    {
      try {
        const data = await asyncSocket<TransportOptions>(
          this.socket,
          "create-webrtc-transport",
          this.roomId
        );

        let producerTransport = this.mediasoupDevice.createSendTransport(data);
        this.producerTransport = producerTransport;
        this.initProducerTransportEvents();
      } catch (err) {
        console.error("failed to create producer transport: ", err);
      }
    }

    // consumer transport
    {
      try {
        const data = await asyncSocket<TransportOptions>(
          this.socket,
          "create-webrtc-transport",
          this.roomId
        );

        let consumerTransport = this.mediasoupDevice.createRecvTransport(data);
        this.consumerTransport = consumerTransport;
        this.initConsumerTransportEvents();
      } catch (err: any) {
        console.error("failed to create consumer transport", err);
      }
    }
  };

  initProducerTransportEvents = () => {
    if (!this.producerTransport) {
      console.error("Producer transport missing");
      return;
    }
    // procucer transport listeners
    this.producerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await asyncSocket<string>(
            this.socket,
            "connect-transport",
            this.roomId,
            this.producerTransport!.id,
            dtlsParameters
          );

          callback();
        } catch (err: any) {
          errback(err);
        }
      }
    );

    this.producerTransport.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errorback) => {
        try {
          const { producerId } = await asyncSocket<{ producerId: string }>(
            this.socket,
            "produce",
            this.roomId,
            kind,
            rtpParameters,
            this.producerTransport!.id
          );

          const producers = await asyncSocket<RemoteProducer[]>(
            this.socket,
            "get-producers",
            this.roomId
          );

          callback({ id: producerId });

          // TODO handle getting existing producers list and consuming them
          producers.forEach((producer) =>
            this.consume({
              remoteProducer: producer,
            })
          );
        } catch (err: any) {
          errorback(err);
        }
      }
    );

    this.producerTransport.on("connectionstatechange", (state) => {
      switch (state) {
        case "connecting":
          break;

        case "connected":
          break;

        case "failed":
          this.producerTransport!.close();
          break;

        default:
          break;
      }
    });
  };

  initConsumerTransportEvents = () => {
    if (!this.consumerTransport) {
      console.log("consumer transport is missing");
      return;
    }
    this.consumerTransport.on(
      "connect",
      async ({ dtlsParameters }, callback, errback) => {
        try {
          const message = await asyncSocket<string>(
            this.socket,
            "connect-transport",
            this.roomId,
            this.consumerTransport!.id,
            dtlsParameters
          );

          console.log(message);
          callback();
        } catch (err: any) {
          errback(err);
        }
      }
    );

    this.consumerTransport.on("connectionstatechange", async (state) => {
      switch (state) {
        case "connecting":
          break;

        case "connected":
          //localVideo.srcObject = stream
          break;

        case "failed":
          this.consumerTransport!.close();
          break;

        default:
          break;
      }
    });
  };

  private addConsumer({
    user,
    consumer,
  }: {
    consumer: Consumer<AppData>;
    user: {
      name: string;
      socketId: string;
      id: string;
    };
  }) {
    const { peers } = useStore.getState();
    // chedck if peer already exist
    // if it exist then add new comsumer to the consumers array inside peers
    if (peers.has(user.id)) {
      console.log("RUNNING CONSUMER ALREADY EXIST");
      const updatedPeers = new Map(peers);
      updatedPeers.get(user.id)?.consumers.push(consumer);
      this.setState({ peers: updatedPeers });

      this.consumers.set(consumer.id, { consumer, user });
      return;
    } else {
      // if not create new peer
      const newPeer: Peer = {
        name: user.name,
        id: user.id,
        socketId: user.socketId,
        consumers: [consumer],
      };

      const updatedPeers = new Map(peers);
      updatedPeers.set(newPeer.id, newPeer);
      this.setState({ peers: updatedPeers });

      // mandatory add consumer to consumers global map
      this.consumers.set(consumer.id, { consumer, user });
    }
  }

  private async closeProducer(producerId: string) {
    asyncSocket(this.socket, "producer-closed", this.roomId, producerId);
  }

  private removeConsumer(consumerId: string) {
    const { peers } = useStore.getState();
    const consumer = this.consumers.get(consumerId);

    const updatedPeers = new Map(peers);
    const peer = updatedPeers.get(consumer?.user.id!);
    if (peer) {
      const consumers = peer?.consumers.filter((cons) => {
        return cons.id !== consumerId;
      });

      peer.consumers = consumers;

      if (!peer?.consumers.length) {
        updatedPeers.delete(peer?.id!);
      }

      this.setState({ peers: updatedPeers });
    }

    this.consumers.delete(consumerId);
  }

  toggleLocalStreamControls = (statement: "audio" | "video") => {
    const { localPeer, localMedia } = useStore.getState();

    if (statement === "video") {
      this.setState({
        localPeer: { ...localPeer, shareCam: !localPeer.shareCam },
      });
      localMedia.videoTrack!.enabled = !localPeer.shareCam;
    } else {
      this.setState({
        localPeer: { ...localPeer, shareMic: !localPeer.shareMic },
      });
      localMedia.audioTrack!.enabled = !localPeer.shareMic;
    }
  };

  async shareScreen() {
    try {
      this.sharingScreen = true;
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Capture video
        audio: true, // Capture audio
      });

      const audioTrack = mediaStream.getAudioTracks()[0];
      const videoTrack = mediaStream.getVideoTracks()[0];

      // await videoTrack.applyConstraints({
      //   width: { min: 640, max: 1920, ideal: 1920 },
      //   height: { min: 400, max: 1080, ideal: 1080 },
      // });

      this.setState({
        localMediaScreen: { audioTrack, videoTrack, mediaStream },
      });
    } catch (err) {
      console.error(err);
    }
  }

  // TODO FIX CLOSING OF SCREEN
  cleanLocalMedia(type: "video" | "screen") {
    if (type === "video") {
      const { localMedia } = useStore.getState();
      if (localMedia.mediaStream) {
        localMedia.mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    } else {
      this.sharingScreen = false;
      const { localMediaScreen } = useStore.getState();
      if (localMediaScreen.mediaStream) {
        localMediaScreen.mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      this.setState({
        localMediaScreen: {
          mediaStream: null,
          audioTrack: null,
          videoTrack: null,
        },
      });
    }
  }
}

export default RoomClient;
