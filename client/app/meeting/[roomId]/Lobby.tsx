"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import useStore from "@/store/useStore";
import usePageLoaded from "@/hooks/usePageLoaded";
import BtnPrimary from "@/components/ui/buttons/BtnPrimary";
import VideoControlBtn from "@/components/ui/buttons/VideoControlBtn";
import {
  BiVideo,
  BiVideoOff,
  BiMicrophone,
  BiMicrophoneOff,
} from "react-icons/bi";

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
  const localPeer = useStore((state) => state.localPeer);
  const setLocalPeerData = useStore((state) => state.setLocalPeerData);
  const { mediaStream } = useStore((state) => state.localMedia);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, []);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

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
        <div className="flex-1 w-full  flex items-center justify-center px-4 ">
          <div className="w-full max-w-[90%]  video-height overflow-clip bg-black   relative rounded-lg">
            {mediaStream ? (
              <>
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  ref={videoRef}
                />

                {/* Video Controls */}
                <div className="absolute left-[50%] flex items-center gap-3 -translate-x-[50%] bottom-3">
                  <VideoControlBtn
                    className={`h-14 w-14 text-2xl border-2  ut-animation  ${
                      localPeer.shareCam
                        ? "border-zinc-500 hover:bg-colorText/20 "
                        : "bg-red-500 border-transparent"
                    }`}
                    falseLogo={<BiVideoOff />}
                    state={localPeer.shareCam}
                    trueLogo={<BiVideo />}
                    onClick={() => {
                      setLocalPeerData({
                        ...localPeer,
                        shareCam: !localPeer.shareCam,
                      });
                    }}
                  />

                  <VideoControlBtn
                    className={`h-14 w-14 text-2xl border-2  ut-animation  ${
                      localPeer.shareMic
                        ? "border-zinc-500 hover:bg-colorText/20 "
                        : "bg-red-500 border-transparent"
                    }`}
                    falseLogo={<BiMicrophoneOff />}
                    state={localPeer.shareMic}
                    trueLogo={<BiMicrophone />}
                    onClick={() => {
                      setLocalPeerData({
                        ...localPeer,
                        shareMic: !localPeer.shareMic,
                      });
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="bg-black absolute inset-0"></div>
            )}
          </div>
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
