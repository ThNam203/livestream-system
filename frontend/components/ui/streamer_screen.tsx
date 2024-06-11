"use client";
import React, { useEffect, useMemo, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

const StreamerScreen = ({ source }: { source: MediaStream }) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<Player | null>(null);

  const videoJsOptions = useMemo(
    () => ({
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
    }),
    []
  );

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current!.appendChild(videoElement);

      const player = (playerRef.current!! = videojs(
        videoElement,
        videoJsOptions,
        () => {}
      ));

      setSrcObjectForPlayer(player, source);
      // You could update an existing player in the `else` block here
      // on prop change, for example:
    }
  }, [videoRef, source]);

  function setSrcObjectForPlayer(vjsPlayer: Player, mediaStream: MediaStream | null) {
    if (!mediaStream) {
      return;
    }
    const videoElement = vjsPlayer.tech({}).el() as HTMLVideoElement;
    videoElement.srcObject = null;
    videoElement.srcObject = mediaStream;
    vjsPlayer.play = () => videoElement.play(); // works with that fix
    vjsPlayer.play();
  }
  

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return <div ref={videoRef} />;
};


export default StreamerScreen;
