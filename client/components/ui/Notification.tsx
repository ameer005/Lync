"use client";

import { useRef, useEffect } from "react";
import NotificationSound from "../../public/audio/join-sound.mp3";
const Notification = () => {
  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.play();
    }
  }, []);

  return (
    <div>
      <audio ref={audioPlayer} src={NotificationSound} />{" "}
    </div>
  );
};

export default Notification;
