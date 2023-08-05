"use client";
import { useState, useRef, useEffect } from "react";
import { useFetchMessages } from "@/hooks/queries/useMessage";
import useStore from "@/store/useStore";
import MessageForm from "./MessageForm";
import LoadingCircle from "../LoadingSpinners/LoadingCircle";
import MessageList from "@/components/list/message/MessageList";
import { MessageDocument } from "@/types/api/messages";

interface ComponentProps {
  roomId: string;
}

const MessageBox = ({ roomId }: ComponentProps) => {
  const user = useStore((state) => state.user);
  const socket = useStore((state) => state.socket);
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [newMessage, setNewMessage] = useState<MessageDocument | null>(null);
  const { data: messagesData, isLoading: messagesIsLoading } =
    useFetchMessages(roomId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages(messagesData?.messages!);
  }, [messagesData]);

  useEffect(() => {
    // initial message
    if (messages.length === 0 && roomId === newMessage?.room._id) {
      setMessages((prev) => [...prev, newMessage]);
    }

    // rest messages
    if (
      messages[messages.length - 1] &&
      roomId === newMessage?.room._id &&
      newMessage?._id !== messages[messages.length - 1]?._id
    ) {
      setMessages((prev) => [...prev, newMessage]);
    }
  }, [newMessage]);

  useEffect(() => {
    socket.on("get-message", (data: MessageDocument) => {
      setNewMessage(data);
    });
  }, []);

  return (
    <div className="h-full w-full flex flex-col border border-colorTeriroty/60 ">
      <div
        ref={containerRef}
        className=" bg-colorWhite scrollbar flex flex-1 flex-col gap-4 overflow-y-scroll px-6 sm:px-4 py-2 pt-5"
      >
        {/* <MessagesList /> */}
        <div className="">{messagesIsLoading && <LoadingCircle />}</div>
        <MessageList list={messages} />
        <div ref={scrollRef}></div>
      </div>

      <MessageForm roomId={roomId} />
    </div>
  );
};

export default MessageBox;
