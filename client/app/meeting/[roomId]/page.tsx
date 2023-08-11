"use client";

import { useState } from "react";
import useRoomClient from "@/hooks/useRoomClient";
import Lobby from "./Lobby";
import MeetingBoard from "./MeetingBoard";

interface PageProps {
  params: {
    roomId: string;
  };
}

const MeetingPage = ({ params }: PageProps) => {
  const [isJoined, setIsJoined] = useState(false);
  // initializing rooms data
  useRoomClient();

  if (!isJoined) {
    return <Lobby roomId={params.roomId} setIsJoined={setIsJoined} />;
  }

  return (
    <div>
      <MeetingBoard roomId={params.roomId} />
    </div>
  );
};

export default MeetingPage;
