import { StateCreator } from "zustand";
import { AppData, Consumer } from "mediasoup-client/lib/types";

export type Peer = {
  name: string;
  socketId: string;
  id: string;
  consumers: Consumer<AppData>[];
};

type LocalPeer = {
  shareMic: boolean;
  shareCam: boolean;
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
  isJoinedRoom: boolean;
  localMedia: LocalMedia;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  setLocalMediaData: (data: LocalMedia) => void;
  localPeer: LocalPeer;
}

const meetingSlice: StateCreator<MeetingSlice> = (set, get) => ({
  me: {
    id: null,
  },
  peers: new Map(),
  isJoinedRoom: false,
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
  setLocalMediaData: (data: LocalMedia) => {
    set({ localMedia: data });
  },
});

export default meetingSlice;
