import { StateCreator } from "zustand";
import { io, Socket } from "socket.io-client";

export interface MeetingSlice {
  localStream: MediaStream | null;
  me: {
    shareMic: boolean;
    shareCam: boolean;
  };
  setMeetingData: (modal: Partial<MeetingSlice>) => void;
}

const meetingSlice: StateCreator<MeetingSlice> = (set, get) => ({
  localStream: null,
  me: {
    shareMic: true,
    shareCam: true,
  },
  setMeetingData: (modal: Partial<MeetingSlice>) => {
    set(modal);
  },
});

export default meetingSlice;
