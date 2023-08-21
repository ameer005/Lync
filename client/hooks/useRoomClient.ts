"useclient";
import { useEffect, useState } from "react";
import useStore from "@/store/useStore";
import {
  initConsumerTransportEvents,
  initProducerTransportEvents,
  produce,
} from "@/lib/webrtc-helpers";
import { asyncSocket } from "@/utils/helpers";

const useRoomClient = (roomId: string) => {
  const setLocalMediaData = useStore((state) => state.setLocalMediaData);
  const localMedia = useStore((state) => state.localMedia);
  const localPeer = useStore((state) => state.localPeer);
  const producerTransport = useStore((state) => state.producerTransport);
  const consumerTransport = useStore((state) => state.consumerTransport);
  const cleanupMeetingData = useStore((state) => state.cleanupMeetingData);
  const mediasoupDevice = useStore((state) => state.mediasoupDevice);
  const updateConsumers = useStore((state) => state.updateConsumers);
  const producers = useStore((state) => state.producers);
  const updateProducers = useStore((state) => state.updateProducers);
  const socket = useStore((state) => state.socket);
  const consumers = useStore((state) => state.consumers);

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

  // TODO will remove it tracking producers
  useEffect(() => {
    console.log("producers: ", producers);
  }, [producers]);

  useEffect(() => {
    console.log("consumers :", consumers);
  }, [consumers]);

  // clean up
  useEffect(() => {
    return () => {
      cleanupLocalMedia();
    };
  }, [localMedia]);

  useEffect(() => {
    toggleLocalStreamControls();
  }, [localPeer.shareCam, localPeer.shareMic]);

  // INITIALIZING TRANSPORTS
  useEffect(() => {
    if (producerTransport && consumerTransport) {
      initConsumerTransportEvents({ consumerTransport, roomId, socket });
      initProducerTransportEvents({
        producerTransport,
        roomId,
        socket,
        consumerTransport,
        mediasoupDevice,
        updateConsumers,
      });
      produce({
        localMedia,
        producerTransport,
        updateProducers,
        socket,
        roomId,
      });
    }
  }, [producerTransport, consumerTransport]);

  //**************************FUNCTIONS**************************//

  // getting user cam and audio access
  // separating audio and video track for more controls
  // storing them to global state
  const startLocalStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 400, max: 1080 },
        },
      });

      const audioTrack = mediaStream.getAudioTracks()[0];
      const videoTrack = mediaStream.getVideoTracks()[0];

      setLocalMediaData({ mediaStream, audioTrack, videoTrack });
    } catch (error: any) {
      console.error(error.message);
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
