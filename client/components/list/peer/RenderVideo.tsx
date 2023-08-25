import { Consumer } from "mediasoup-client/lib/Consumer";
import { AppData } from "mediasoup-client/lib/types";
import { useEffect, useRef } from "react";

interface ComponentProps {
  consumer: Consumer<AppData>;
  user: { name: string; id: string; socketId: string };
}

const RenderVideo = ({ consumer, user }: ComponentProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const { track } = consumer;
      const stream = new MediaStream([track]);

      videoRef.current.srcObject = stream;
    }
  }, []);

  return (
    <div className="h-[15rem] w-[20rem]   relative">
      <video
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
