import useStore from "@/store/useStore";

import { useEffect, useRef } from "react";

interface ComponentProps {
  stream: MediaStream;
  user: { name: string; id: string; socketId: string };
}

const RenderVideo = ({ stream, user }: ComponentProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const me = useStore((state) => state.me);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, []);

  return (
    <div className="h-[15rem] w-[20rem]   relative">
      <video
        muted={me.id === user.id}
        autoPlay
        className="absolute inset-0 object-cover"
        ref={videoRef}
      ></video>

      <div className="bg-black font-bold p-4 absolute top-[50%] left-[50%]">
        {user.name}
      </div>
    </div>
  );
};

export default RenderVideo;
