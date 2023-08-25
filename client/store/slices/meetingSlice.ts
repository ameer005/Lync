import { StateCreator } from "zustand";
import { Device } from "mediasoup-client/lib/types";
import * as mediasoup from "mediasoup-client";
import {
  Transport,
  AppData,
  Producer,
  Consumer,
} from "mediasoup-client/lib/types";

type LocalPeer = {
  shareMic: boolean;
  shareCam: boolean;
};

export type Peer = {
  name: string;
  socketId: string;
  id: string;
  consumers: Consumer<AppData>[];
};

export type ConsumerData = {
  consumer: Consumer<AppData>;
  user: {
    name: string;
    socketId: string;
    id: string;
  };
};

export type LocalMedia = {
  mediaStream: MediaStream | null;
  audioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
};

export interface MeetingSlice {
  me: {
    id: string | null;
  };
  peers: Map<string, Peer>;
  producers: Map<string, Producer<AppData>>;
  consumers: Map<string, ConsumerData>;

  mediasoupDevice: Device;
  producerTransport: Transport<AppData> | null;
  consumerTransport: Transport<AppData> | null;
  localMedia: LocalMedia;
  localPeer: LocalPeer;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  setLocalPeerData: (data: LocalPeer) => void;
  setLocalMediaData: (data: LocalMedia) => void;
  cleanupMeetingData: () => void;
  updateProducers: (data: { key: string; value?: Producer<AppData> }) => void;
  updateConsumers: (data: { key: string; value?: ConsumerData }) => void;
}

const meetingSlice: StateCreator<MeetingSlice> = (set, get) => ({
  me: {
    id: null,
  },
  peers: new Map(),
  producers: new Map(),
  producerTransport: null,
  consumerTransport: null,
  consumers: new Map(),
  mediasoupDevice: new mediasoup.Device(),
  localMedia: {
    mediaStream: null,
    audioTrack: null,
    videoTrack: null,
  },
  localPeer: {
    shareMic: true,
    shareCam: true,
  },

  // state changer
  setMeetingData: (modal: Partial<MeetingSlice>) => {
    set(modal);
  },
  setLocalPeerData: (data: LocalPeer) => {
    set({ localPeer: data });
  },
  setLocalMediaData: (data: LocalMedia) => {
    set({ localMedia: data });
  },

  updateProducers: ({ key, value }) => {
    set((state) => {
      const updatedProducers = new Map(state.producers);

      if (value) {
        updatedProducers.set(key, value);
      } else {
        updatedProducers.delete(key);
      }

      return { producers: updatedProducers };
    });
  },
  updateConsumers: ({ key, value }) => {
    set((state) => {
      const updatedConsumers = new Map(state.consumers);

      if (value) {
        updatedConsumers.set(key, value);
      } else {
        updatedConsumers.delete(key);
      }

      return { consumers: updatedConsumers };
    });
  },

  cleanupMeetingData: () => {
    set({
      consumerTransport: null,
      producerTransport: null,
      producers: new Map(),
      consumers: new Map(),
      mediasoupDevice: new mediasoup.Device(),
      me: {
        id: null,
      },
    });
  },
});

export default meetingSlice;
