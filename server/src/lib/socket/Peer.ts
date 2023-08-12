import {
  Consumer,
  Producer,
  Transport,
  DtlsParameters,
  RtpParameters,
  MediaKind,
  RtpCapabilities,
} from "mediasoup/node/lib/types";

class Peer {
  public socketId: string;
  public id: string;
  public name: string;
  public transport: Map<string, Transport> = new Map();
  public consumers: Map<string, Consumer> = new Map();
  public producers: Map<string, Producer> = new Map();

  constructor(socketId: string, id: string, name: string) {
    this.socketId = socketId;
    this.id = id;
    this.name = name;
  }

  addTransport(transport: Transport) {
    this.transport.set(transport.id, transport);
  }

  // initiating connection between client and server
  async connectTransport(transportId: string, dtlsParameters: DtlsParameters) {
    if (!this.transport.has(transportId)) return;

    await this.transport.get(transportId)?.connect({ dtlsParameters });
  }

  // creatomg media producer
  async createProducer(
    producerTransportId: string,
    rtpParameters: RtpParameters,
    kind: MediaKind
  ) {
    let producer = await this.transport
      .get(producerTransportId)
      ?.produce({ kind, rtpParameters });

    if (!producer) return;
    this.producers.set(producer.id, producer);

    producer.on("transportclose", () => {
      console.log("Producer transport closed: ", {
        name: `${this.name}`,
        consumer_id: `${producer!.id}`,
      });

      producer?.close();
      this.producers.delete(producer?.id!);
    });

    return producer;
  }

  async createConsumer(
    consumerTransportId: string,
    producerId: string,
    rtpCapabilities: RtpCapabilities
  ) {
    let consumerTransport = this.transport.get(consumerTransportId);

    let consumer: Consumer | undefined;

    try {
      consumer = await consumerTransport?.consume({
        producerId,
        rtpCapabilities,
        paused: false,
      });
    } catch (error) {
      console.error("Consuming failed: ", error);
      return;
    }

    if (consumer?.type == "simulcast") {
      await consumer.setPreferredLayers({
        spatialLayer: 2,
        temporalLayer: 2,
      });
    }

    if (!consumer) return;

    this.consumers.set(consumer?.id!, consumer!);

    consumer?.on("transportclose", () => {
      console.log("Consumer transport close", {
        name: `${this.name}`,
        consumer_id: `${consumer!.id}`,
      });

      this.consumers.delete(consumer!.id);
    });

    return {
      consumer,
      params: {
        producerId,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      },
    };
  }

  removeConsumer(consumerId: string) {
    this.consumers.delete(consumerId);
  }

  getProducer(producerId: string) {
    return this.producers.get(producerId);
  }

  closeProducer(producerId: string) {
    this.producers.get(producerId)?.close();
  }

  // closing connection between client and server
  close() {
    this.transport.forEach((transport) => transport.close());
  }
}

export default Peer;
