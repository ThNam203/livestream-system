import { UserToReceive } from "@/converter/userConverter";
import AxiosService from "./axiosService";

const getInfo = () => {
  return AxiosService.get("/user/info", { withCredentials: true }).then(
    (res) => {
      return UserToReceive(res.data);
    }
  );
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

const UserService = {
  getInfo,
  updateProfile,
  updatePassword,
};

export default UserService;
