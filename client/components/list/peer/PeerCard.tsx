"use client";

import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import { UserData } from "./PeerList1";
import { useEffect, useRef, useState } from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import PeerAvatar from "@/components/ui/meeting/PeerAvatar";
import PeerHoverCtrs from "@/components/ui/meeting/PeerHoverCtrs";
import { BsPin, BsPinFill } from "react-icons/bs";

interface ComponentProps {
  data: UserData;
}

const PeerCard = ({ data }: ComponentProps) => {
  const router = useRouter();
  const me = useStore((state) => state.me);
  const pinnedStream = useStore((state) => state.pinnedStream);
  const setMeetingData = useStore((state) => state.setMeetingData);
  const socket = useStore((state) => state.socket);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // TODO set initial state with socket
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showHoverControls, setShowHovercontrols] = useState(false);

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
            setIsVideoMuted(!res.state);
          } else {
            setIsAudioMuted(!res.state);
          }
        }
      }
    );

    socket.on("listen-remove-user", (res) => {
      router.push("/");
    });
  }, []);

  return (
    <div
      onClick={() => {
        setShowHovercontrols((prev) => !prev);
      }}
      className={`h-full w-full min-h-[20rem] relative bg-colorDark1 rounded-md overflow-hidden  ${
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
            className="h-[8rem] w-[8rem] md:h-[7.5rem] md:w-[7.5rem]"
            username={data.user.name}
          />
        </div>
      )}

      {showHoverControls && (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="px-4 bg-colorSecondary2 absolute top-[50%] -translate-x-[50%] -translate-y-[50%] left-[50%]  py-3 rounded-full"
        >
          <div className="flex gap-4 items-center">
            <div>
              {pinnedStream?.mediaStream.id === data.mediaStream.id ? (
                <button onClick={() => setMeetingData({ pinnedStream: null })}>
                  <BsPinFill className="h-5 w-5" />
                </button>
              ) : (
                <button onClick={() => setMeetingData({ pinnedStream: data })}>
                  <BsPin className="h-5 w-5" />
                </button>
              )}
            </div>
            <PeerHoverCtrs user={data.user} />
          </div>
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
