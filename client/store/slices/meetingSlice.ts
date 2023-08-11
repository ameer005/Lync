import { StateCreator } from "zustand";

type LocalPeer = {
  shareMic: boolean;
  shareCam: boolean;
};

type LocalMedia = {
  mediaStream: MediaStream | null;
  audioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
};

export interface MeetingSlice {
  localMedia: LocalMedia;
  localPeer: LocalPeer;
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
  setLocalPeerData: (data: LocalPeer) => void;
  setLocalMediaData: (data: LocalMedia) => void;
}

const meetingSlice: StateCreator<MeetingSlice> = (set, get) => ({
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
});

export default meetingSlice;
