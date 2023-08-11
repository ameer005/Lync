import { create } from "zustand";
import { devtools } from "zustand/middleware";
import userSlice, { UserSlice } from "./slices/userSlice";
import switchStateSlice, { SwitchStateSlice } from "./slices/switchStateSlice";
import modalSlice, { ModalSlice } from "./slices/modalSlice";
import dataSlice, { DataSlice } from "./slices/dataSlice";
import meetingSlice, { MeetingSlice } from "./slices/meetingSlice";

export type UseStore = UserSlice &
  SwitchStateSlice &
  ModalSlice &
  DataSlice &
  MeetingSlice;

const useStore = create<UseStore>()(
  devtools((...a) => ({
    ...userSlice(...a),
    ...switchStateSlice(...a),
    ...modalSlice(...a),
    ...dataSlice(...a),
    ...meetingSlice(...a),
  }))
);

export default useStore;
