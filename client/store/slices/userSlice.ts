import { StateCreator } from "zustand";
import { UserDocument } from "@/types/api/user";

export interface UserSlice {
  user: UserDocument | null;
  token: string | null;
  email?: string;
  setUser: (user: any) => void;
  setUserEmail: (email: string) => void;
  removeUser: () => void;
  setToken: (token: string) => void;
}

let user: any;
if (typeof window !== "undefined") {
  user = JSON.parse(localStorage.getItem("user")!);
}

const userSlice: StateCreator<UserSlice> = (set, get) => ({
  user: user || null,
  token: null,
  email: "",
  setUser: (user) => {
    set({ user: user });
  },
  setUserEmail: (email) => {
    set({ email: email });
  },
  removeUser: () => {
    set({ user: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
  setToken: (token: string) => {
    set({ token: token });
  },
});

export default userSlice;
