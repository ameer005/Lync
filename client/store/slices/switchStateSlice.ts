import { StateCreator } from "zustand";

export interface SwitchStateSlice {
  authScreen:
    | "Login"
    | "Sign Up"
    | "Verify"
    | "Forgot Password"
    | "Validate Forgot";
  setOptions: (modal: Partial<SwitchStateSlice>) => void;
}

const switchStateSlice: StateCreator<SwitchStateSlice> = (set, get) => ({
  authScreen: "Login",
  setOptions: (modal: Partial<SwitchStateSlice>) => {
    set(modal);
  },
});

export default switchStateSlice;
