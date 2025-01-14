import { FC, useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  hlsSrc: string;
  options?: Player["options"];
}

export const VideoPlayer: FC<VideoPlayerProps> = ({
  hlsSrc,
  options,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  const initializePlayer = () => {
    if (videoRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      playerRef.current = videojs(videoElement, {
        controls: true,
        fluid: true,
        sources: [{ src: hlsSrc, type: "application/x-mpegURL" }],
        ...options,
      });
    }
  };

  useEffect(() => {
    // Dispose and reinitialize the player whenever hlsSrc changes
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;

      // Clear the previous video element
      if (videoRef.current) {
        videoRef.current.innerHTML = "";
      }
    }

    // Initialize the player with the new settings
    initializePlayer();
  }, [hlsSrc, options]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};
