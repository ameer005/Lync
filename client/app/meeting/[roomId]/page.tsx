"use client";

import { useState } from "react";
import useRoomClient from "@/hooks/useRoomClient";
import Lobby from "../../../components/ui/meeting/Lobby";
import MeetingBoard from "../../../components/ui/meeting/MeetingBoard";
import useStore from "@/store/useStore";
import RoomClient from "@/lib/roomClient";

interface PageProps {
  params: {
    roomId: string;
  };
}

const MeetingPage = ({ params }: PageProps) => {
  const isJoinedRoom = useStore((state) => state.isJoinedRoom);
  const [roomClient, setRoomClient] = useState<RoomClient>(
    new RoomClient(params.roomId)
  );
  // initializing rooms data
  useRoomClient({ roomClient, roomId: params.roomId });

  if (!isJoinedRoom) {
    return <Lobby roomId={params.roomId} roomClient={roomClient} />;
  }

  return (
    <div>
      <MeetingBoard roomId={params.roomId} />
    </div>
  );
};

export default MeetingPage;
