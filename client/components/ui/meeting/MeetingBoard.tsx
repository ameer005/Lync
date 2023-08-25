"use client";

import PeerList1 from "@/components/list/peer/PeerList1";
import useStore from "@/store/useStore";
import { useEffect } from "react";

interface ComponentProps {
  roomId: string;
}

const MeetingBoard = ({ roomId }: ComponentProps) => {
  const socket = useStore((state) => state.socket);
  const peers = useStore((state) => state.peers);

  // cleanup function

  return (
    <div>
      <PeerList1 list={peers} className="flex gap-2" />
    </div>
  );
};

export default MeetingBoard;
