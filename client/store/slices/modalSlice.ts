import { StateCreator } from "zustand";

export interface ModalSlice {
  showAuthModal: boolean;
  setModalState: (modal: Partial<ModalSlice>) => void;
}

const modalSlice: StateCreator<ModalSlice> = (set, get) => ({
  showAuthModal: false,
  setModalState: (modal: Partial<ModalSlice>) => {
    set(modal);
  },
});

export default modalSlice;
