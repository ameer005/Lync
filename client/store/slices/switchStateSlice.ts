import { StateCreator } from "zustand";

export interface SwitchStateSlice {
  setOptions: (modal: Partial<SwitchStateSlice>) => void;
}

const switchStateSlice: StateCreator<SwitchStateSlice> = (set, get) => ({
  setOptions: (modal: Partial<SwitchStateSlice>) => {
    set(modal);
  },
});

export default switchStateSlice;
