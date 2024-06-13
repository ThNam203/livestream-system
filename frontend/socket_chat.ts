import io from "socket.io-client";

const socket_chat = io("http://localhost:3333/chat", {
  withCredentials: true,
  transports: ["websocket"],
});

export { socket_chat };
