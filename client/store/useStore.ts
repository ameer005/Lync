import { create } from "zustand";
import { devtools } from "zustand/middleware";
import userSlice, { UserSlice } from "./slices/userSlice";
import switchStateSlice, { SwitchStateSlice } from "./slices/switchStateSlice";
import modalSlice, { ModalSlice } from "./slices/modalSlice";
import dataSlice, { DataSlice } from "./slices/dataSlice";

type UseStore = UserSlice & SwitchStateSlice & ModalSlice & DataSlice;

const useStore = create<UseStore>()(
  devtools((...a) => ({
    ...userSlice(...a),
    ...switchStateSlice(...a),
    ...modalSlice(...a),
    ...dataSlice(...a),
  }))
);

export default useStore;
