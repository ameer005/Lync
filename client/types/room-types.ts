import { Consumer, AppData } from "mediasoup-client/lib/types";

export type User = { name: string; socketId: string; id: string };

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

export type RemoteProducer = {
  producers: string[];
  user: User;
};

export type Message = {
  user: User;
  text: string;
};
