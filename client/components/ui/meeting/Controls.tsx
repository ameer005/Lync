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

interface ComponentProps {
  roomId: string;
  roomClient: RoomClient;
}

const Controls = ({ roomClient, roomId }: ComponentProps) => {
  const localPeer = useStore((state) => state.localPeer);
  const router = useRouter();

  return (
    <div className="absolute px-4 py-2 rounded-md flex gap-3 items-center bottom-4 left-[50%] -translate-x-[50%]  bg-black">
      <VideoControlBtn
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
        className={`text-2xl ${localPeer.shareCam ? "" : ""}`}
        falseLogo={<BiMicrophoneOff />}
        state={true}
        trueLogo={<MdOutlineScreenShare />}
        onClick={() => {
          // roomClient.toggleLocalStreamControls("audio");
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
