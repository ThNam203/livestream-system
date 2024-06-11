import { Channel } from "./channel";

export type User = {
  id: number;
  username: string;
  bio: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  password: string;
  birth: Date;
  channel: Channel;
};

//some props will develop later

// blockedUsers: number[];
//   // privateMessages
//   location: string;
//   createdDate: Date;
//   linkAccount: string;
//   followers: number[];
//   followings: number[];
//   backgroundPicture: string;
//   // activity: livestreamsParticipatedIn, comments, likes
