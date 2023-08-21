"use client";

import { useState } from "react";
import useRoomClient from "@/hooks/useRoomClient";
import Lobby from "../../../components/ui/meeting/Lobby";
import MeetingBoard from "../../../components/ui/meeting/MeetingBoard";

interface PageProps {
  params: {
    roomId: string;
  };
}

const MeetingPage = ({ params }: PageProps) => {
  const [isJoined, setIsJoined] = useState(false);
  // initializing rooms data
  useRoomClient(params.roomId);

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
