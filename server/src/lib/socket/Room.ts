import {
  Router,
  DtlsParameters,
  RtpParameters,
  MediaKind,
  RtpCapabilities,
  Producer,
} from "mediasoup/node/lib/types";
import { IO } from "../../types/shared";
import Peer from "./Peer";
import { config } from "../../global/config";

type BroadcastEvent = "new-producer" | "consumer-closed";

class Room {
  public roomId: string;
  private io: IO;
  private peers: Map<string, Peer> = new Map();
  private admin: string;
  private router: Router;

  constructor(roomId: string, admin_id: string, io: IO, router: Router) {
    this.roomId = roomId;
    this.io = io;
    this.admin = admin_id;
    this.router = router;
  }

  // adding and removing peers from meeting
  addPeer(peer: Peer) {
    this.peers.set(peer.id, peer);
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
        console.error(error);
      }
    }

    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "closed") {
        console.log("Transport close: ", this.peers.get(socketId)?.name);
        transport.close();
      }
    });

    transport.on("@close", () => {
      console.log("Transport close: ", this.peers.get(socketId)?.name);
    });

    console.log("Adding transport", { transportId: transport.id });
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
    dtlsParameters: DtlsParameters
  ) {
    if (!this.peers.has(socketId)) return;
    this.peers.get(socketId)?.connectTransport(transportId, dtlsParameters);
  }

  async produce(
    socketId: string,
    producerTransportId: string,
    rtpParameters: RtpParameters,
    kind: MediaKind
  ) {
    return new Promise(async (resolve, _) => {
      let producer = await this.peers
        .get(socketId)
        ?.createProducer(producerTransportId, rtpParameters, kind);

      if (!producer) return;
      this.broadCast("new-producer", {
        producer_id: producer.id,
        producer_socketId: socketId,
      });

      resolve(producer.id);
    });
  }

  async consume(
    socketId: string,
    consumerTransportId: string,
    producerId: string,
    rtpCapabilities: RtpCapabilities
  ) {
    if (!this.router.canConsume({ producerId, rtpCapabilities })) {
      console.error("cannot consume");
      return;
    }

    const res = await this.peers
      .get(socketId)
      ?.createConsumer(consumerTransportId, producerId, rtpCapabilities);

    if (!res) return;
    const { consumer, params } = res;

    consumer.on("producerclose", () => {
      console.log("Consumer closed due to producer close event", {
        name: `${this.peers.get(socketId)?.name}`,
        consumer_id: `${consumer.id}`,
      });

      this.broadCast("consumer-closed", consumer.id);
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
    let producerList: { producerId: string }[] = [];
    this.peers.forEach((peer) => {
      peer.producers.forEach((producer) => {
        producerList.push({ producerId: producer.id });
      });
    });
    return producerList;
  }

  isPeerInRoom(socketId: string) {
    return this.peers.has(socketId);
  }

  toJson() {
    return {
      id: this.roomId,
      peers: JSON.stringify([...this.peers]),
    };
  }
}

export default Room;
