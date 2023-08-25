"use client";

import { Peer } from "@/store/slices/meetingSlice";
import PeerCard from "./PeerCard";

interface ComponentProps {
  list: Map<string, Peer>;
  className: string;
}

const PeerList1 = ({ list, className }: ComponentProps) => {
  const renderList = () => {
    const cards = [];
    for (let value of list.values()) {
      cards.push(<PeerCard key={value.id} data={value} />);
    }

    return cards;
  };
  return <div className={className}>{renderList()}</div>;
};

export default PeerList1;
