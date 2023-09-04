"use client";

import useStore from "@/store/useStore";
import { UserData } from "./PeerList1";
import { useEffect, useRef, useState } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import PeerAvatar from "@/components/ui/meeting/PeerAvatar";

interface ComponentProps {
  data: UserData;
}

const PeerCard = ({ data }: ComponentProps) => {
  const me = useStore((state) => state.me);
  const socket = useStore((state) => state.socket);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // TODO set initial state with socket
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = data.mediaStream;
    }
  }, []);

  useEffect(() => {
    socket.on(
      "listen-media-toggle",
      (res: {
        socketId: string;
        state: boolean;
        control: "audio" | "video";
      }) => {
        if (res.socketId === data.user.socketId) {
          if (res.control === "video") {
            console.log("vide: ", res.state);
            setIsVideoMuted(!res.state);
          } else {
            setIsAudioMuted(!res.state);
          }
        }
      }
    );
  }, []);

  console.log("video muted: ", isVideoMuted);

  return (
    <div
      className={`h-full w-full relative bg-colorDark1 rounded-md overflow-hidden  ${
        me.id === data.user.id && "peer-card-border"
      }`}
    >
      <video
        muted={me.id === data.user.id}
        autoPlay
        className="absolute  h-full w-full inset-0 object-cover"
        ref={videoRef}
      ></video>

      {isVideoMuted && (
        <div className="absolute h-full w-full inset-0 flex items-center justify-center bg-colorDark1">
          <PeerAvatar
            className="h-[15rem] w-[15rem]"
            username={data.user.name}
          />
        </div>
      )}

      <div className="bg-colorSecondary2 flex items-center gap-2 font-medium py-2 px-4 rounded-md text-xs shadow-colorDark2 shadow-md  absolute bottom-2 left-4">
        {isAudioMuted ? (
          <BiMicrophoneOff className="h-4 w-4" />
        ) : (
          <BiMicrophone className="h-4 w-4" />
        )}

        <div> {data.user.name} </div>
      </div>
    </div>
  );
};

export default PeerCard;
