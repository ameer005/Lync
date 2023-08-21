"use client";
import { ConsumerData } from "@/store/slices/meetingSlice";
import { useEffect, useRef } from "react";

interface ComponentProps {
  data: ConsumerData;
}

const PeerCard = ({ data }: ComponentProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const { track } = data.consumer;
      const stream = new MediaStream();
      stream.addTrack(track);

      videoRef.current.srcObject = stream;
    }
  }, []);

  return (
    <div className="h-[15rem] w-[20rem] bg-colorPrimary">
      <video
        autoPlay
        className="absolute inset-0 object-cover"
        ref={videoRef}
      ></video>
    </div>
  );
};

export default PeerCard;
