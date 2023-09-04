import { Consumer, AppData } from "mediasoup-client/lib/types";

export type Peer = {
  name: string;
  socketId: string;
  id: string;
  consumers: Consumer<AppData>[];
  meidaStreams: MediaStream[];
};

export type ConsumerData = {
  consumer: Consumer<AppData>;
  user: {
    name: string;
    socketId: string;
    id: string;
  };
};

export interface RemoteProducer {
  producers: string[];
  user: { name: string; socketId: string; id: string };
}
