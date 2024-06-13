import { User } from "./user";

export type Streaming = {
  id: any;
  ownerId: any;
  viewers: number;
  title: string;
  chats: string[];
  startedTime: Date;
  tags: string[];
  category: string;
};

export type Channel = {
  id: number;
  title: string;
  channelName: string;
  tags: string[];
  streamKey: string;
  enableLLHLS: boolean;
  user: User;
  liveStreaming: boolean;
};
