"use client";

import PeerList1 from "@/components/list/peer/PeerList1";
import useStore from "@/store/useStore";
import { useEffect } from "react";

interface ComponentProps {
  roomId: string;
}

const MeetingBoard = ({ roomId }: ComponentProps) => {
  const peers = useStore((state) => state.peers);

  // cleanup function

  return (
    <div className="h-full">
      <PeerList1 list={peers} className="flex gap-2 h-full w-full" />
    </div>
  );
};

export default MeetingBoard;
