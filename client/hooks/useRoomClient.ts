"useclient";
import { useEffect, useState } from "react";
import useStore from "@/store/useStore";

const useRoomClient = () => {
  const setLocalMediaData = useStore((state) => state.setLocalMediaData);
  const localMedia = useStore((state) => state.localMedia);
  const localPeer = useStore((state) => state.localPeer);
  const mediasoupDevice = useStore((state) => state.mediasoupDevice);

  //**************************USE EFFECTS**************************//

  // Initializing data
  useEffect(() => {
    startLocalStream();
  }, []);

  // clean up
  useEffect(() => {
    return () => {
      cleanupLocalMedia();
    };
  }, [localMedia]);

  useEffect(() => {
    toggleLocalStreamControls();
  }, [localPeer.shareCam, localPeer.shareMic]);

  //**************************FUNCTIONS**************************//

  // getting user cam and audio access
  // separating audio and video track for more controls
  // storing them to global state
  const startLocalStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      const audioTrack = mediaStream.getAudioTracks()[0];
      const videoTrack = mediaStream.getVideoTracks()[0];
      setLocalMediaData({ mediaStream, audioTrack, videoTrack });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLocalStreamControls = () => {
    if (localMedia.audioTrack && localMedia.videoTrack) {
      localMedia.audioTrack.enabled = localPeer.shareMic;
      localMedia.videoTrack.enabled = localPeer.shareCam;
    }
  };

  const cleanupLocalMedia = () => {
    if (localMedia.mediaStream) {
      localMedia.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalMediaData({
        mediaStream: null,
        audioTrack: null,
        videoTrack: null,
      });
    }
  };

  return null;
};

export default useRoomClient;
