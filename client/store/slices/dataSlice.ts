import { StateCreator } from "zustand";

import { io, Socket } from "socket.io-client";

let URL = process.env.BACKEND_URL!;

if (process.env.NODE_ENV !== "production") {
  URL = "http://127.0.0.1:5000";
}

type LocalUserPermissions = {
  cam: boolean;
  audio: boolean;
  screen: boolean;
};

export interface DataSlice {
  socket: Socket;
  localUserPermissions: LocalUserPermissions;
  setGlobalData: (modal: Partial<DataSlice>) => void;
}

const dataSlice: StateCreator<DataSlice> = (set, get) => ({
  socket: io(URL),
  localUserPermissions: {
    audio: false,
    cam: false,
    screen: false,
  },
  setGlobalData: (modal: Partial<DataSlice>) => {
    set(modal);
  },
});

export default dataSlice;
