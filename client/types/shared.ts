export interface RemoteProducer {
  producers: string[];
  user: { name: string; socketId: string; id: string };
}
