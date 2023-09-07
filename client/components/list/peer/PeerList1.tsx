"use client";

import { Peer } from "@/types/room-types";
import PeerCard from "./PeerCard";
import { useEffect, useState } from "react";

interface ComponentProps {
  list: Map<string, Peer>;
  className: string;
}

export type UserData = {
  user: { name: string; id: string; socketId: string };
  mediaStream: MediaStream;
  isScreen: boolean;
};

const PeerList1 = ({ list, className }: ComponentProps) => {
  const [userStreams, setUserStreams] = useState<UserData[]>([]);

  useEffect(() => {
    buildMediaStreams();
  }, [list]);

  const buildMediaStreams = () => {
    let userStreams: UserData[] = [];
    for (let value of list.values()) {
      value.meidaStreams.forEach((stream, i) => {
        let isScreen = false;
        if (i === 1) {
          isScreen = true;
        }
        userStreams.push({
          mediaStream: stream,
          user: { id: value.id, socketId: value.socketId, name: value.name },
          isScreen: isScreen,
        });
      });
    }

    setUserStreams(userStreams);
  };

  const renderList = () => {
    return userStreams.map((data) => {
      return <PeerCard data={data} key={data.mediaStream.id} />;
    });
  };

  return (
    <div className={`${className} meeting-grid gap-4 `}>{renderList()}</div>
  );
};

export default PeerList1;
