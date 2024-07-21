"use client";
import { nanoid } from "nanoid";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidVideoPlus } from "react-icons/bi";
import { BsKeyboardFill } from "react-icons/bs";
import { asyncSocket } from "@/utils/helpers";
import { useCheckAuth } from "@/hooks/queries/useAuth";
import LoadingCircle from "./LoadingSpinners/LoadingCircle";

const RoomMenu = () => {
  const [roomInput, setRoomInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const socket = useStore((state) => state.socket);
  const user = useStore((state) => state.user);
  const router = useRouter();
  const setModalState = useStore((state) => state.setModalState);
  const { mutate, isSuccess } = useCheckAuth();

  useEffect(() => {
    if (isSuccess) {
      createRoom();
    }
  }, [isSuccess]);

  const createRoom = async () => {
    if (user) {
      setIsLoading(true);
      const data = { roomId: nanoid(), adminId: user._id };
      try {
        // prettier-ignore
        await asyncSocket<any>(socket,"create-room",data.roomId,data.adminId);
        router.push(`/meeting/${data.roomId}`);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    } else {
      setModalState({ showAuthModal: true });
    }
  };

  return (
    <div className="flex gap-5 sm:flex-col">
      <button
        disabled={isLoading}
        onClick={async () => {
          mutate();
        }}
        className="bg-colorPrimary w-full max-w-[170.38px] sm:max-w-none sm:justify-center flex items-center gap-2 text-colorBg font-medium hover:bg-colorPrimaryLight py-3 rounded-md px-6 text-base"
      >
        {isLoading ? (
          <div className="w-full flex justify-center">
            <LoadingCircle />
          </div>
        ) : (
          <>
            <BiSolidVideoPlus className="h-5 w-5" />
            <div className="shrink-0">New Meeting</div>
          </>
        )}
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
          {/*sdkjfkl*/}
        </label>
        {roomInput ? (
          <button
            onClick={async () => {
              try {
                await asyncSocket<any>(socket, "get-room", roomInput);
                router.push(`/meeting/${roomInput}`);
              } catch (err) {
                setModalState({
                  showToastModal: true,
                  toastProperties: {
                    message: "Please provide valid meeting ID",
                    title: "Room doesn't exist",
                    type: "error",
                  },
                });
                console.log(err);
              }
            }}
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
