import { StateCreator } from "zustand";
import { Device } from "mediasoup-client/lib/types";
import * as mediasoup from "mediasoup-client";
import { Transport, AppData, Producer } from "mediasoup-client/lib/types";
import { Consumer } from "react";

type LocalPeer = {
  shareMic: boolean;
  shareCam: boolean;
};

export type LocalMedia = {
  mediaStream: MediaStream | null;
  audioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
};

export interface MeetingSlice {
  mediasoupDevice: Device;
  producerTransport: Transport<AppData> | null;
  consumerTransport: Transport<AppData> | null;
  producers: Map<string, Producer<AppData>>;
  consumers: Map<string, Consumer<AppData>>;
  localMedia: LocalMedia;
  localPeer: LocalPeer;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  setLocalPeerData: (data: LocalPeer) => void;
  setLocalMediaData: (data: LocalMedia) => void;
  cleanupMeetingData: () => void;
}

const meetingSlice: StateCreator<MeetingSlice> = (set, get) => ({
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
  cleanupMeetingData: () => {
    set({ consumerTransport: null, producerTransport: null });
  },
});

export default meetingSlice;
