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
  const socket = useStore((state) => state.socket);
  const peers = useStore((state) => state.peers);
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
          shareCam: false,
          shareMic: false,
          videoTrack: null,
        },
      });
    };
  }, []);

  useEffect(() => {
    if (peers) {
      console.log("peers: ", peers);
    }
  }, [peers]);

  useEffect(() => {
    return () => {
      cleanupLocalMedia();
    };
  }, [localMedia]);

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

  const cleanupLocalMedia = () => {
    if (localMedia.mediaStream) {
      localMedia.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  return null;
};

export default useRoomClient;
