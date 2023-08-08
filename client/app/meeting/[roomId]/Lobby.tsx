"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import useStore from "@/store/useStore";
import usePageLoaded from "@/hooks/usePageLoaded";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";

interface ComponentProps {
  setIsJoined: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
}

const Lobby = ({ setIsJoined, roomId }: ComponentProps) => {
  const user = useStore((state) => state.user);
  const isPageLoaded = usePageLoaded();
  const [name, setName] = useState("");
  const socket = useStore((state) => state.socket);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, []);

  const onJoinRoom = () => {
    if (!name) return;
    const payload = {
      name,
      id: user?._id || nanoid(),
    };

    socket.emit("join-room", roomId, payload, (res: any) => {
      if (res.status === "success") {
        setIsJoined(true);
      } else {
        // TODO
        // implement toas notification
        router.push("/");
        console.log("room doesn't exist");
      }
    });
  };
  return (
    <div className="h-screen w-full flex justify-center">
      <div className="h-full w-full max-w-[77rem] flex ">
        {/* screen */}
        <div className="flex-1 flex items-center px-4 ">
          <div className="h-[28rem] w-full bg-black rounded-lg"></div>
        </div>

        {/*  */}
        <div className="w-[39%] px-4 flex gap-7 flex-col justify-center items-center">
          <div className="w-full">
            {isPageLoaded && user ? (
              <div className="font-medium text-xl text-center">
                Ready to join?
              </div>
            ) : (
              <label className="w-full">
                <input
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  type="text"
                  className="w-full px-3 mb-1 border-b-2 bg-zinc-300/10 border-zinc-600 py-3 outline-none "
                />
                <div className="w-full flex justify-end text-xs text-zinc-400">
                  <div>{`${name.length}/60`}</div>
                </div>
              </label>
            )}
          </div>

          <BtnPrimary
            onClick={onJoinRoom}
            isLoading={false}
            className="text-colorBg text-base rounded-md"
            name="Join"
          />
        </div>
      </div>
    </div>
  );
};

export default Lobby;
