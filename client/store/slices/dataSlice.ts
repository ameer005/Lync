import { StateCreator } from "zustand";

import { io, Socket } from "socket.io-client";

let URL: string;

if (process.env.NODE_ENV !== "production") {
  URL = "http://127.0.0.1:5000/api/v1";
} else {
  URL = `${process.env.BACKEND_URL!}/api/v1`;
}

export interface DataSlice {
  socket: Socket;
  setGlobalData: (modal: Partial<DataSlice>) => void;
}

const dataSlice: StateCreator<DataSlice> = (set, get) => ({
  socket: io(URL),
  setGlobalData: (modal: Partial<DataSlice>) => {
    set(modal);
  },
});

export default dataSlice;
