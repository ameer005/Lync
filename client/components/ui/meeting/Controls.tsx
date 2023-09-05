"use client";
import { useRouter } from "next/navigation";
import RoomClient from "@/lib/roomClient";
import useStore from "@/store/useStore";
import {
  BiVideo,
  BiVideoOff,
  BiMicrophone,
  BiMicrophoneOff,
} from "react-icons/bi";

import { MdOutlineScreenShare, MdOutlineCallEnd } from "react-icons/md";
import VideoControlBtn from "../buttons/VideoControlBtn";
import { useEffect } from "react";

interface ComponentProps {
  roomId: string;
  roomClient: RoomClient;
}

const Controls = ({ roomClient, roomId }: ComponentProps) => {
  const localPeer = useStore((state) => state.localPeer);
  const router = useRouter();

  return (
    <div className="absolute px-6 py-2 rounded-md flex gap-3 items-center bottom-8 left-[50%] -translate-x-[50%] shadow-lg shadow-colorDark2 bg-colorDark2">
      <VideoControlBtn
        tooltip="stop camera"
        className={`text-2xl ${localPeer.shareCam ? "" : ""}`}
        falseLogo={<BiVideoOff />}
        state={localPeer.shareCam}
        trueLogo={<BiVideo />}
        onClick={() => {
          roomClient.toggleLocalStreamControls("video");
        }}
      />

      <VideoControlBtn
        className={`text-2xl ${localPeer.shareCam ? "" : ""}`}
        falseLogo={<BiMicrophoneOff />}
        state={localPeer.shareMic}
        trueLogo={<BiMicrophone />}
        onClick={() => {
          roomClient.toggleLocalStreamControls("audio");
        }}
      />

      <VideoControlBtn
        className={`text-2xl ${roomClient.sharingScreen ? "bg-zinc-400" : ""}`}
        falseLogo={<BiMicrophoneOff />}
        state={true}
        trueLogo={<MdOutlineScreenShare />}
        onClick={async () => {
          if (roomClient.sharingScreen) {
            roomClient.cleanLocalMedia("screen");
          } else {
            await roomClient.shareScreen();
            await roomClient.produce("screen-video");
          }

          // await roomClient.produce("screen-audio");
        }}
      />

      <VideoControlBtn
        className={`text-2xl bg-colorError ${localPeer.shareCam ? "" : ""}`}
        falseLogo={<BiMicrophoneOff />}
        state={true}
        trueLogo={<MdOutlineCallEnd />}
        onClick={() => {
          router.push("/");
          // roomClient.toggleLocalStreamControls("audio");
        }}
      />
    </div>
  );
};

export default Controls;
