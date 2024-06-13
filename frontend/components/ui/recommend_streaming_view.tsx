"use client";

import {
  IconButton,
  RoundedImageButton,
  TagButton,
} from "@/components/ui/buttons";
import { Hover3DBox } from "@/components/ui/hover_3d_box";
import { Channel, Streaming } from "@/entities/channel";
import { users } from "@/fakedata/leftbar";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { MoreVertical } from "lucide-react";
import { ReactNode } from "react";
import streaming_img from "../../public/images/live_user_zackrawrr-440x248.jpg";
import { socket_chat } from "@/socket_chat";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import UserService from "@/services/userService";
import { setChannel } from "@/redux/slices/channel";
import { useAppDispatch } from "@/redux/hooks";
import { showErrorToast } from "./toast";
import ChannelService from "@/services/channelService";

const ContentView = ({
  title,
  channel,
  category,
  tags,
}: {
  title: string;
  channel: string;
  category: string | undefined;
  tags: string[];
}) => {
  return (
    <div className="flex flex-row gap-2">
      <RoundedImageButton />
      <div className="flex-1 flex-col space-y-1">
        <div className="w-full flex flex-row items-center justify-between font-semibold">
          <span className="text-sm hover:text-primary cursor-pointer">
            {title}
          </span>

          <IconButton icon={<MoreVertical className="w-4 h-4" />} />
        </div>
        <div className="text-sm text-secondaryWord cursor-pointer">
          {channel}
        </div>
        <div className="text-sm text-secondaryWord hover:text-primary cursor-pointer">
          {category ? category : null}
        </div>
        <div className="flex flex-row gap-2 justify-self-end">
          {tags.map((tag, idx) => {
            return <TagButton key={idx} content={tag} />;
          })}
        </div>
      </div>
    </div>
  );
};

const LiveChannelView = ({
  className,
  viewers,
  category,
  channel,
  onClick,
}: {
  className?: ClassValue;
  viewers: number;
  channel: Channel;
  category?: string;
  onClick?: () => void;
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Hover3DBox
        viewers={viewers}
        showViewer={true}
        showStreaming={channel.liveStreaming}
        imageSrc={streaming_img}
        className="h-[170px]"
        onClick={onClick}
      />
      <ContentView
        channel={channel.channelName}
        title={channel.title}
        category={category}
        tags={channel.tags}
      />
    </div>
  );
};

const LiveChannelListView = ({
  limitView,
  channels,
}: {
  limitView: number;
  channels: Channel[];
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const channelsToShow = channels.slice(0, limitView);

  const handleStartStream = async (channel: Channel) => {
    await ChannelService.startLiveStream(channel.streamKey)
      .then((res) => {
        dispatch(setChannel(res));
      })
      .catch((err) => showErrorToast(err));
  };

  return (
    <div className="w-full grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-4">
      {channelsToShow.map((channel, idx) => {
        return (
          <LiveChannelView
            key={idx}
            channel={channel}
            viewers={120}
            onClick={() => {
              handleStartStream(channel);
              setCookie("isStreaming", JSON.stringify(false));
              router.push(`/livestreaming`);
            }}
          />
        );
      })}
    </div>
  );
};

const RecommendStreamingView = ({
  title,
  channels,
  limitView = 4,
  separate,
}: {
  title: ReactNode;
  channels: Channel[];
  limitView?: number;
  separate: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mt-8 pr-2",
        channels.length === 0 && "hidden"
      )}
    >
      <div className="font-semibold text-lg">{title}</div>
      <LiveChannelListView limitView={limitView} channels={channels} />
      {channels.length > limitView && separate}
    </div>
  );
};

export {
  ContentView,
  LiveChannelListView,
  LiveChannelView,
  RecommendStreamingView,
};
