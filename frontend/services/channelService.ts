import { UpdateChannelFormData } from "@/app/(home)/setting/page";
import { Channel } from "@/entities/channel";
import AxiosService from "./axiosService";

const checkStreamKey = (streamKey: String) => {
  return AxiosService.post(
    "/channel/check-stream-key",
    {
      streamKey: streamKey,
    },
    { withCredentials: true }
  ).then((res) => res.data);
};

const updateStreamKey = () => {
  return AxiosService.put(
    "/channel/stream-key",
    {},
    { withCredentials: true }
  ).then((res) => res.data as string);
};

const getChannel = () => {
  return AxiosService.get("/channel/get-channel", {
    withCredentials: true,
  }).then((res) => {
    console.log("res get channel", res.data);
    return res.data as Channel;
  });
};

const updateChannel = (data: UpdateChannelFormData) => {
  return AxiosService.put("/channel/update-channel", data, {
    withCredentials: true,
  });
};

const startLiveStream = (streamKey: string) => {
  return AxiosService.post("/channel/live/start", {
    streamKey: streamKey,
  }).then((res) => res.data as Channel);
};

const stopLiveStream = (streamKey: string) => {
  return AxiosService.post("/channel/live/end", {
    streamKey: streamKey,
  }).then((res) => res.data as Channel);
};

const getAllLiveChannels = () => {
  return AxiosService.get("/channel/live/all").then(
    (res) => res.data as Channel[]
  );
};

const ChannelService = {
  checkStreamKey,
  updateStreamKey,
  updateChannel,
  startLiveStream,
  stopLiveStream,
  getChannel,
  getAllLiveChannels,
};

export default ChannelService;
