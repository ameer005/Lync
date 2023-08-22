"use client";
import { ConsumerData } from "@/store/slices/meetingSlice";
import useStore from "@/store/useStore";
import { useEffect, useRef } from "react";

interface ComponentProps {
  data: ConsumerData;
}

const PeerCard = ({ data }: ComponentProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const { track } = data.consumer;
      const stream = new MediaStream([track]);

      videoRef.current.srcObject = stream;
    }
  }, []);

  return (
    <div className="h-[15rem] w-[20rem] bg-colorPrimary relative">
      <video
        autoPlay
        className="absolute inset-0 object-cover"
        ref={videoRef}
      ></video>

      <div className="bg-black font-bold p-4 absolute top-[50%] left-[50%]">
        {data.user.name}
      </div>
    </div>
  );
};

export default PeerCard;
