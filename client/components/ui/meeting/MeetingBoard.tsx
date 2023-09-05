"use client";

import PeerCard from "@/components/list/peer/PeerCard";
import PeerList1 from "@/components/list/peer/PeerList1";
import useStore from "@/store/useStore";

interface ComponentProps {
  roomId: string;
}

const MeetingBoard = ({ roomId }: ComponentProps) => {
  const peers = useStore((state) => state.peers);
  const pinnedStream = useStore((state) => state.pinnedStream);

  return (
    <div className="h-full p-5 sm:p-2 bg-zinc-950 overflow-y-scroll">
      {pinnedStream ? (
        <div className="h-full w-full">
          <PeerCard data={pinnedStream} />{" "}
        </div>
      ) : (
        <PeerList1 list={peers} className="flex gap-2 h-full w-full" />
      )}
    </div>
  );
};

export default MeetingBoard;
