"use client";

// import { StreamerScreen } from "@/components/streamer_screen";
import socket from "@/socket";
import Image from "next/image";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import StreamerScreen from "@/components/ui/streamer_screen";
const ReactPlayer = dynamic(() => import("react-player/file"), { ssr: false });

export default function LivestreamingDemo() {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [mixedStream, setMixedStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const setupStreams = async () => {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        sampleRate: 44100,
      },
    });

    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        sampleRate: 44100,
      },
    });

    videoStream.getVideoTracks()[0].onended = () => {
      alert("Your screen sharing has ended");
      setVideoStream(null);
      setMicStream(null);
      setMixedStream(null);

      if (recorder) {
        recorder.stop();
        setRecorder(null);
      }
    };

    setVideoStream(videoStream);
    setMicStream(micStream);
  };

  useEffect(() => {
    if (videoStream && micStream) {
      const mixedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...micStream.getTracks(),
      ]);

      const recorder = new MediaRecorder(mixedStream, {
        mimeType: "video/webm",
      });

      socket.emit("config_rtmpDestination", "rtmp://10.0.188.191/live/nam");
      socket.emit("start", "start");

      recorder.ondataavailable = (event) => {
        socket.emit("binarystream", event.data);
      };

      recorder.start(200);
      setRecorder(recorder);
      setMixedStream(mixedStream);
    }
  }, [videoStream, micStream]);

  const startRecording = () => {
    setupStreams();
  };

  return (
    <div className="flex flex-col gap-4">
      <div data-vjs-player className="w-4/5 border">
        {mixedStream ? (
          <StreamerScreen source={mixedStream} />
        ) : (
          <div className="h-[576px] w-full flex flex-col bg-black items-center justify-center text-white">
            <h3 className="text-3xl font-bold">You are currently offline!</h3>
            <button
              className="p-2 bg-purple-500 rounded-sm mt-8"
              onClick={startRecording}
            >
              Start livestream
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-row ml-4 gap-4 items-center">
        <div className="border-2 border-purple-400 rounded-full h-16 w-16 relative">
          <Image
            src="/images/cat.png"
            alt="Picture of the author"
            width={64}
            height={64}
          />
          <div className="absolute left-0 bottom-[-2px] right-0 bg-red-600 rounded-md">
            <p className="text-white text-xs py-[1px] font-semibold text-center">
              LIVE
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-base font-bold">Cat</p>
          <p className="text-base">Im playing NIKKE this time</p>
          <div className="flex gap-2 mt-1">
            <StreamTag name="Game" />
            <StreamTag name="FPS" />
            <StreamTag name="Shooter" />
          </div>
        </div>
      </div>
    </div>
  );
}

const StreamTag = ({ name }: { name: string }) => {
  return <p className="px-2 py-1 rounded-md bg-slate-400 text-xs">{name}</p>;
};
