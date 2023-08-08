"use client";

import React, { useState } from "react";
import Lobby from "./Lobby";

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

  return <div>yo fuckin meetin</div>;
};

export default MeetingPage;
