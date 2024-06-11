export type ChatMessageProps = {
  roomId: number;
  sender: string;
  message: string;
  time: string;
  type: "JOIN" | "LEAVE" | "CHAT";
};

export type ChatRoomProps = {
  roomId: number;
  roomName: string;
  adminId: number;
  userIds: number[];
  messages: ChatMessageProps[];
};
