import { StateCreator } from "zustand";

type ToastProperties = {
  type: null | "error" | "success" | "info";
  title: string;
  message: string;
};

export interface ModalSlice {
  showAuthModal: boolean;
  showToastModal: boolean;
  toastProperties: ToastProperties;
  setModalState: (modal: Partial<ModalSlice>) => void;
}

const modalSlice: StateCreator<ModalSlice> = (set, get) => ({
  showAuthModal: false,
  showToastModal: false,
  toastProperties: {
    type: null,
    title: "",
    message: "",
  },
  setModalState: (modal: Partial<ModalSlice>) => {
    set(modal);
  },
});

export default modalSlice;
