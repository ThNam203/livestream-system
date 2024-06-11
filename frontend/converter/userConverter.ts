import { User } from "@/entities/user";

export const UserToReceive = (data: any) => {
  const user: User = {
    id: data.id,
    username: data.username,
    bio: data.bio,
    avatar: data.avatar,
    email: data.email,
    phoneNumber: data.phoneNumber,
    password: data.password,
    birth: new Date(data.birth),
    channel: data.channel,
  };
  return user;
};

export const UserToSend = (data: User) => {
  const user = {
    id: data.id,
    username: data.username,
    bio: data.bio,
    avatar: data.avatar,
    email: data.email,
    phoneNumber: data.phoneNumber,
    password: data.password,
    birth: data.birth.toISOString(),
    channel: data.channel,
  };
  return user;
};
