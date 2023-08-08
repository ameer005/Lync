"use client";

import useStore from "@/store/useStore";
import { useEffect } from "react";

interface ComponentProps {
  roomId: string;
}

const MeetingBoard = ({ roomId }: ComponentProps) => {
  const socket = useStore((state) => state.socket);

  // cleanup function
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      socket.emit("leave-room", roomId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      socket.emit("leave-room", roomId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return <div>yo fuckin meeting</div>;
};

export default MeetingBoard;
