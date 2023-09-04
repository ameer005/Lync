"use client";

import PeerList1 from "@/components/list/peer/PeerList1";
import useStore from "@/store/useStore";

interface ComponentProps {
  roomId: string;
}

const MeetingBoard = ({ roomId }: ComponentProps) => {
  const peers = useStore((state) => state.peers);

  // cleanup function

  return (
    <div className="h-full py-5 px-5 bg-zinc-950">
      <PeerList1 list={peers} className="flex gap-2 h-full w-full" />
    </div>
  );
};

export default MeetingBoard;
