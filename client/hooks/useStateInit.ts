"useclient";
import { useEffect } from "react";
import useStore from "@/store/useStore";

const useStateInit = () => {
  const setMeetingData = useStore((state) => state.setMeetingData);
  const localStream = useStore((state) => state.localStream);
  const me = useStore((state) => state.me);

  // handling local stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: me.shareMic, video: me.shareCam })
      .then((currentStream) => setMeetingData({ localStream: currentStream }));
  }, []);

  return null;
};

export default useStateInit;
