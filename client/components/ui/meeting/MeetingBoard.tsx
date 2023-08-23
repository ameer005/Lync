"use client";

import PeerList1 from "@/components/list/peer/PeerList1";
import useStore from "@/store/useStore";
import { useEffect } from "react";

interface ComponentProps {
  roomId: string;
}

const MeetingBoard = ({ roomId }: ComponentProps) => {
  const socket = useStore((state) => state.socket);
  const consumers = useStore((state) => state.consumers);

  // cleanup function

  return (
    <div>
      <PeerList1 list={consumers} className="flex gap-2" />
    </div>
  );
};

export default MeetingBoard;
