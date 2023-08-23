"useclient";
import { useEffect, useState } from "react";
import useStore from "@/store/useStore";
import {
  consume,
  initConsumerTransportEvents,
  initProducerTransportEvents,
  produce,
} from "@/lib/webrtc-helpers";
import { asyncSocket } from "@/utils/helpers";
import { RemoteProducer } from "@/types/shared";

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

  const [newProducer, setNewProducer] = useState<RemoteProducer | null>(null);
  const [consumerLeftId, setConsumerLefId] = useState("");

  //**************************USE EFFECTS**************************//

  useEffect(() => {
    socket.on("new-producer", (res: RemoteProducer) => {
      setNewProducer(res);
    });

    socket.on("consumer-closed", (id: string) => {
      setConsumerLefId(id);
    });
  }, []);

  useEffect(() => {
    // TODO refactor it so it can handle multiple stream producers joining at the same time
    // avoid consuming same stream producer multiple times

    if (newProducer) {
      consume({
        consumerTransport,
        mediasoupDevice,
        remoteProducer: newProducer,
        roomId,
        socket,
        updateConsumers,
      });
      setNewProducer(null);
    }
  }, [newProducer]);

  useEffect(() => {
    if (consumerLeftId) {
      updateConsumers({ key: consumerLeftId });
    }
  }, [consumerLeftId]);

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

  // CLEANUP FUNCTION
  useEffect(() => {
    return () => {
      cleanupLocalMedia();
    };
  }, [localMedia]);

  useEffect(() => {
    toggleLocalStreamControls();
  }, [localPeer.shareCam, localPeer.shareMic]);

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
