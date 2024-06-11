import io from "socket.io-client";
import { ChatRoomProps } from "./entities/chatMessage";

const socket_chat = io("http://localhost:8080/chat", {
  withCredentials: true,
  transports: ["websocket"],
});

export { socket_chat };
