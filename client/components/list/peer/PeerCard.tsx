"use client";
import { Peer } from "@/store/slices/meetingSlice";
import useStore from "@/store/useStore";
import { useEffect, useRef } from "react";
import RenderVideo from "./RenderVideo";

interface ComponentProps {
  data: Peer;
}

const PeerCard = ({ data }: ComponentProps) => {
  const renderList = () => {
    return data.consumers.map((consumer) => {
      return (
        <RenderVideo
          user={{ id: data.id, name: data.name, socketId: data.socketId }}
          key={consumer.id}
          consumer={consumer}
        />
      );
    });
  };

  return <div className="flex gap-2">{renderList()}</div>;
};

export default PeerCard;
