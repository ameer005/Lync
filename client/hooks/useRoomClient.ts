"useclient";
import { useEffect } from "react";
import useStore from "@/store/useStore";
import RoomClient from "@/lib/roomClient";

interface ComponentProps {
  roomId: string;
  roomClient: RoomClient;
}

const useRoomClient = ({ roomClient, roomId }: ComponentProps) => {
  const localMedia = useStore((state) => state.localMedia);
  const localMediaScreen = useStore((state) => state.localMediaScreen);
  const socket = useStore((state) => state.socket);
  const setMeetingData = useStore((state) => state.setMeetingData);

  useEffect(() => {
    roomClient.startLocalStream();

    return () => {
      setMeetingData({
        peers: new Map(),
        me: { id: null },
        isJoinedRoom: false,
        localMedia: {
          audioTrack: null,
          mediaStream: null,
          videoTrack: null,
        },
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      if (localMedia.mediaStream) {
        roomClient.cleanLocalMedia("video");
      }
    };
  }, [localMedia]);

  useEffect(() => {
    return () => {
      if (localMediaScreen.mediaStream) {
        roomClient.cleanLocalMedia("screen");
      }
    };
  }, [localMediaScreen]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      socket.emit("leave-room", roomId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      socket.emit("leave-room", roomId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default useRoomClient;
