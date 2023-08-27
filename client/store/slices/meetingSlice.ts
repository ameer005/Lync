import { StateCreator } from "zustand";
import { Device } from "mediasoup-client/lib/types";
import * as mediasoup from "mediasoup-client";
import { AppData, Consumer } from "mediasoup-client/lib/types";

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
  shareMic: boolean;
  shareCam: boolean;
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
    shareCam: false,
    shareMic: false,
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
