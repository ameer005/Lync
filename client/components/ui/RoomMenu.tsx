"use client";
import { nanoid } from "nanoid";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidVideoPlus } from "react-icons/bi";
import { BsKeyboardFill } from "react-icons/bs";

const RoomMenu = () => {
  const [roomInput, setRoomInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const socket = useStore((state) => state.socket);
  const user = useStore((state) => state.user);
  const router = useRouter();
  const setModalState = useStore((state) => state.setModalState);
  return (
    <div className="flex gap-5 sm:flex-col">
      <button
        disabled={isLoading}
        onClick={() => {
          if (user) {
            setIsLoading(true);
            const data = {
              roomId: nanoid(),
              adminId: user._id,
            };
            socket.emit(
              "create-room",
              data.roomId,
              data.adminId,
              (res: any) => {
                if (res.status === "success") {
                  router.push(`/meeting/${data.roomId}`);
                }
              }
            );
          } else {
            setModalState({ showAuthModal: true });
          }
        }}
        className="bg-colorPrimary sm:justify-center flex items-center gap-2 text-colorBg font-medium hover:bg-colorPrimaryLight py-3 rounded-md px-6 text-base"
      >
        <BiSolidVideoPlus className="h-5 w-5" />
        <div>New Meeting</div>
      </button>

      <div className="flex-1 flex gap-1 items-center">
        <label className="w-full relative">
          <input
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            type="text"
            className="outline-none py-4 rounded-md ut-animation w-full px-4 pl-11 bg-transparent focus:border-colorPrimary border border-colorDark1 h-full"
          />

          <BsKeyboardFill className="h-5 w-5 text-zinc-400 absolute left-3 top-[50%] -translate-y-[50%]" />
        </label>
        {roomInput ? (
          <button
            onClick={() =>
              socket.emit("get-room", roomInput, (res: any) => {
                if (res.status === "success") {
                  router.push(`/meeting/${roomInput}`);
                } else {
                  // TODO implement toast error
                  console.log("no");
                }
              })
            }
            className="h-full px-4 font-medium text-zinc-400"
          >
            Join
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default RoomMenu;
