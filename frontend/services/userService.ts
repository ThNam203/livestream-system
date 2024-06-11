import { UserToReceive } from "@/converter/userConverter";
import AxiosService from "./axiosService";
import { UpdateChannelFormData } from "@/app/(home)/setting/page";

const getInfo = () => {
  return AxiosService.get("/user/info", { withCredentials: true }).then(
    (res) => {
      return UserToReceive(res.data);
    }
  );
};

const checkStreamKey = (streamKey: String) => {
  return AxiosService.post(
    "/user/check-stream-key",
    {
      streamKey: streamKey,
    },
    {
      withCredentials: true,
    }
  ).then((res) => res.data);
};

const updateStreamKey = () => {
  return AxiosService.put("/user/stream-key", {}, { withCredentials: true });
};

export interface UpdateProfileProps {
  username: string;
  email: string;
  bio: string;
  birth: string;
}
const updateProfile = (data: UpdateProfileProps) => {
  return AxiosService.put("/user/update-profile", data, {
    withCredentials: true,
  }).then((res) => {
    return UserToReceive(res.data);
  });
};

export interface UpdatePasswordProps {
  oldPassword: string;
  newPassword: string;
}
const updatePassword = (data: UpdatePasswordProps) => {
  return AxiosService.put("/user/update-password", data, {
    withCredentials: true,
  });
};

const updateChannel = (data: UpdateChannelFormData) => {
  return AxiosService.put("/user/update-channel", data, {
    withCredentials: true,
  });
};

const startLiveStream = () => {
  return AxiosService.post(
    "/user/start-live-stream",
    {},
    { withCredentials: true }
  ).then((res) => UserToReceive(res.data));
};

const stopLiveStream = () => {
  return AxiosService.post(
    "/user/stop-live-stream",
    {},
    { withCredentials: true }
  ).then((res) => UserToReceive(res.data));
};

const UserService = {
  getInfo,
  checkStreamKey,
  updateStreamKey,
  updateProfile,
  updatePassword,
  updateChannel,
  startLiveStream,
  stopLiveStream,
};

export default UserService;
