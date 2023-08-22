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
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { asyncSocket } from "@/utils/helpers";
import { loadDevice, initTransports, produce } from "@/lib/webrtc-helpers";

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
  const localMedia = useStore((state) => state.localMedia);
  const mediasoupDevice = useStore((state) => state.mediasoupDevice);
  const setMeetingData = useStore((state) => state.setMeetingData);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, []);

  useEffect(() => {
    if (localMedia.mediaStream && videoRef.current) {
      // console.log("lobby: ", localMedia.mediaStream);
      videoRef.current.srcObject = localMedia.mediaStream;
    }
  }, [localMedia.mediaStream]);

  const onJoinRoom = async () => {
    if (!name) return;
    try {
      const payload = {
        name,
        id: user?._id || nanoid(),
      };

      // prettier-ignore
      await asyncSocket<any>(socket, "join-room", roomId, payload);
      const rtpCapabilities = await asyncSocket<RtpCapabilities>(
        socket,
        "get-router-rtp-capabilities",
        roomId
      );

      await loadDevice({ mediasoupDevice, rtpCapabilities });
      await initTransports({
        socket,
        roomId,
        mediasoupDevice,
        setMeetingData,
      });
      setIsJoined(true);
    } catch (err) {
      // TODO
      // implement toas notification
      router.push("/");
      console.log("room doesn't exist");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center">
      <div className="h-full w-full max-w-[77rem] xl:flex-col xl:gap-8 xl:pt-10  flex ">
        {/* screen */}
        <div className="w-full    flex items-center justify-center px-4 md:px-0  ">
          <div className="w-full responsive-video-container max-w-[90%] xl:max-w-[100%]   overflow-clip bg-black md:rounded-none   relative rounded-lg">
            {localMedia.mediaStream ? (
              <>
                <video
                  className="h-full w-full object-cover responsive-video"
                  autoPlay
                  muted
                  playsInline
                  ref={videoRef}
                />

                {/* Video Controls */}
                <div className="absolute left-[50%] flex items-center gap-3 -translate-x-[50%] bottom-3">
                  <VideoControlBtn
                    className={`h-14 w-14 sm:h-10 sm:w-10 text-lg border-2  ut-animation  ${
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
                    className={`h-14 w-14 sm:h-10 sm:w-10 text-lg border-2  ut-animation  ${
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
        <div className="w-[39%] xl:w-full px-4 flex gap-7 sm:gap-4 flex-col justify-center items-center">
          <div className="w-full">
            {isPageLoaded && user ? (
              <div className="font-medium text-xl sm:text-lg text-center">
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
            className="text-colorBg sm:py-2 text-base rounded-md"
            name="Join"
          />
        </div>
      </div>
    </div>
  );
};

export default Lobby;