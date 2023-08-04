import { StateCreator } from "zustand";

export interface ModalSlice {
  setModalState: (modal: Partial<ModalSlice>) => void;
}

const modalSlice: StateCreator<ModalSlice> = (set, get) => ({
  setModalState: (modal: Partial<ModalSlice>) => {
    set(modal);
  },
});

export default modalSlice;
