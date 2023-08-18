"useclient";
import { useEffect, useState } from "react";
import useStore from "@/store/useStore";
import {
  initConsumerTransportEvents,
  initProducerTransportEvents,
} from "@/app/lib/webrtc-helpers";

const useRoomClient = (roomId: string) => {
  const setLocalMediaData = useStore((state) => state.setLocalMediaData);
  const localMedia = useStore((state) => state.localMedia);
  const localPeer = useStore((state) => state.localPeer);
  const producerTransport = useStore((state) => state.producerTransport);
  const consumerTransport = useStore((state) => state.consumerTransport);
  const cleanupMeetingData = useStore((state) => state.cleanupMeetingData);
  const socket = useStore((state) => state.socket);

  //**************************USE EFFECTS**************************//

  // Initializing data
  useEffect(() => {
    startLocalStream();

    // cleaning up normal status
    // which are not depended upon it's values
    return () => {
      cleanupMeetingData();
    };
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

  useEffect(() => {
    if (producerTransport) {
      initProducerTransportEvents({ producerTransport, roomId, socket });
    }
  }, [producerTransport]);

  useEffect(() => {
    if (consumerTransport) {
      initConsumerTransportEvents({ consumerTransport, roomId, socket });
    }
  }, [consumerTransport]);

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
