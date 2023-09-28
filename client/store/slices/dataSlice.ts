import { StateCreator } from "zustand";

import { io, Socket } from "socket.io-client";

let URL: string;
if (process.env.NODE_ENV !== "production") {
  URL = "http://127.0.0.1:5000";
} else {
  URL = `${process.env.NEXT_PUBLIC_BACKEND_URL!}`;
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
