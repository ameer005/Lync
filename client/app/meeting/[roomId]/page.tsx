"use client";

import React, { useEffect, useState } from "react";
import Lobby from "./Lobby";
import MeetingBoard from "./MeetingBoard";

interface PageProps {
  params: {
    roomId: string;
  };
}

const MeetingPage = ({ params }: PageProps) => {
  const [isJoined, setIsJoined] = useState(false);

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
