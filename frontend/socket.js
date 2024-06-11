import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://192.168.93.130:8888";
const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("message", (data) => {
  console.log("message: " + data);
});

socket.on("fatal", function (e) {
  console.log("fatal error" + e);
  socket.disconnect();
});

socket.on("ffmpeg_stderr", function (e) {
  console.log("ffmpeg_stderr" + e);
});

export default socket;
