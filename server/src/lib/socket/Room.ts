import {
  Router,
  DtlsParameters,
  RtpParameters,
  MediaKind,
  RtpCapabilities,
} from "mediasoup/node/lib/types";
import { IO } from "../../types/shared";
import Peer from "./Peer";
import { config } from "../../global/config";
import logger from "../logger";
import { SocketEvents } from "../../types/socket-types";

type BroadcastEvent = "new-producer" | "consumer-closed" | "get-message";
export type Message = {
  user: { name: string; socketId: string; id: string };
  text: string;
};

class Room {
  public roomId: string;
  private io: IO;
  private peers: Map<string, Peer> = new Map();
  public admin: string;
  private router: Router;
  private chat: Message[] = [];

  constructor(roomId: string, admin_id: string, io: IO, router: Router) {
    this.roomId = roomId;
    this.io = io;
    // User's ID in DB
    this.admin = admin_id;
    this.router = router;
  }

  // adding and removing peers from meeting
  addPeer(peer: Peer) {
    this.peers.set(peer.socketId, peer);
  }

  removePeer(socketId: string) {
    this.peers.get(socketId)?.close();
    this.peers.delete(socketId);
  }

  getPeers() {
    return this.peers;
  }

  getRtpCapabilities() {
    return this.router.rtpCapabilities;
  }

  async createWebRtcTransport(socketId: string) {
    const { maxIncomingBitrate, initialAvailableOutgoingBitrate } =
      config.mediasoup.webRtcTransportOptions;

    // creating transport and putting incoming limit
    const transport = await this.router.createWebRtcTransport({
      listenIps: config.mediasoup.webRtcTransportOptions.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    });

    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {
        logger.error(error);
      }
    }

    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "closed") {
        logger.info(`Transport close: ${this.peers.get(socketId)?.name} `);
        transport.close();
      }
    });

    transport.on("@close", () => {
      logger.info(`Transport close: ${this.peers.get(socketId)?.name}`);
    });

    logger.info(
      `Adding transport ${JSON.stringify({ transportId: transport.id })}`,
    );
    this.peers.get(socketId)?.addTransport(transport);

    return {
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    };
  }

  // connecting peer transport
  async connectPeerTransport(
    socketId: string,
    transportId: string,
    dtlsParameters: DtlsParameters,
  ) {
    if (!this.peers.has(socketId)) return;
    this.peers.get(socketId)?.connectTransport(transportId, dtlsParameters);
  }

  async produce(
    socketId: string,
    producerTransportId: string,
    rtpParameters: RtpParameters,
    kind: MediaKind,
  ) {
    return new Promise(async (resolve, _) => {
      const peer = this.peers.get(socketId);
      let producer = await peer?.createProducer(
        producerTransportId,
        rtpParameters,
        kind,
      );

      if (!producer) return;

      this.broadCast(SocketEvents.NEW_PRODUCER, {
        user: {
          name: peer?.name,
          socketId: peer?.socketId,
          id: peer?.id,
        },
        producers: [producer.id],
      });

      resolve(producer.id);
    });
  }

  async consume(
    socketId: string,
    consumerTransportId: string,
    producerId: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    if (!this.router.canConsume({ producerId, rtpCapabilities })) {
      logger.error("cannot consume");
      return;
    }

    const res = await this.peers
      .get(socketId)
      ?.createConsumer(consumerTransportId, producerId, rtpCapabilities);

    if (!res) return;
    const { consumer, params } = res;

    consumer.on("producerclose", () => {
      logger.info(
        `Consumer closed due to producer close event ${JSON.stringify({
          name: `${this.peers.get(socketId)?.name}`,
          consumer_id: `${consumer.id}`,
        })}`,
      );

      // TODO maybe delete consumer from user's array too
      this.broadCast(SocketEvents.CONSUMER_CLOSED, consumer.id);
    });

    return params;
  }

  closeProducer(socketId: string, producerId: string) {
    this.peers.get(socketId)?.closeProducer(producerId);
  }

  broadCast(event: BroadcastEvent, data: any) {
    this.io.to(this.roomId).emit(event, data);
  }

  getProducerListForPeer() {
    let producerList: {
      producers: string[];
      user: { name: string; socketId: string; id: string };
    }[] = [];

    this.peers.forEach((peer) => {
      producerList.push({
        producers: [...peer.producers.keys()],
        user: { name: peer.name, socketId: peer.socketId, id: peer.id },
      });
    });

    return producerList;
  }

  isPeerInRoom(socketId: string) {
    return this.peers.has(socketId);
  }

  addMessage(message: Message) {
    this.chat.push(message);

    this.broadCast("get-message", { data: this.chat });
  }

  toJson() {
    return {
      id: this.roomId,
      peers: JSON.stringify([...this.peers]),
    };
  }
}

export default Room;
