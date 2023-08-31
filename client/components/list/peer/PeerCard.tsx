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
    const mediaStreams: MediaStream[] = [];
    data.consumers.forEach((consumer, i) => {
      const { track } = consumer;
      if (i === 1 && consumer.kind === "audio") {
        mediaStreams[0].addTrack(track);
      } else if (i === 3 && consumer.kind === "audio") {
        mediaStreams[1].addTrack(track);
      } else {
        const stream = new MediaStream([track]);
        mediaStreams.push(stream);
      }
    });

    return mediaStreams.map((stream) => {
      return (
        <RenderVideo
          user={{ id: data.id, name: data.name, socketId: data.socketId }}
          key={stream.id}
          stream={stream}
        />
      );
    });
  };

  // const returnMediaStreams = () => {

  //   return mediaStreams;
  // };

  return <div className="flex gap-2">{renderList()}</div>;
};

export default PeerCard;
