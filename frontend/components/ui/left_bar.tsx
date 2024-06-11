import { ArrowLeftFromLine, ArrowUpDown, Heart, Video } from "lucide-react";
import { IconButton, RoundedImageButton } from "./buttons";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { Channel } from "@/entities/channel";
import { channels, streamings, users } from "@/fakedata/leftbar";
import { channel } from "diagnostics_channel";

const ChannelViewItem = ({
  className,
  name,
  category,
}: {
  className?: ClassValue;
  name: string;
  category: string;
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-row gap-2 items-center justify-between xl:hover:bg-hoverColor px-2",
        className
      )}
    >
      <div className="flex flex-row items-center justify-start">
        <RoundedImageButton />
        <div className="flex flex-col gap-1 ml-2 max-xl:hidden">
          <span className="font-semibold text-sm">{name}</span>
          <span className="text-secondaryWord text-sm">{category}</span>
        </div>
      </div>
      <View viewers={1200} className="max-xl:hidden" />
    </div>
  );
};

const View = ({
  className,
  viewers,
}: {
  className?: ClassValue;
  viewers: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-2",
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-red-600"></span>
      <span className="text-xs">{viewers.toString()}</span>
    </div>
  );
};

const userData = users;
const streamingIds = streamings.map((stream) => stream.ownerId);
const followingChannels: Channel[] = channels.filter((channel) =>
  streamingIds.includes(channel.id)
);

const recommendChannels: Channel[] = [channels[1], channels[2], channels[3]];

export const LeftBar = () => {
  return (
    <div className="fixed h-full xl:w-64 max-xl:w-fit bg-leftBarColor flex flex-col max-xl:items-center justify-start gap-2 py-2 text-primaryWord">
      <div className="flex flex-row justify-between items-center px-2">
        <span className="font-semibold text-lg max-xl:hidden">For you</span>
      </div>
      <div className="flex flex-row justify-between items-center px-2 mt-2">
        <Title icon={<Heart size={20} />}>FOLLOWED CHANNELS</Title>

        <IconButton
          className="self-end max-xl:hidden"
          icon={<ArrowUpDown size={18} />}
          disabled={true}
        />
      </div>
      {followingChannels.map((channel, idx) => {
        const user = userData.find((user) => user.id === channel.ownerId);
        return (
          <ChannelViewItem
            key={idx}
            name={user ? user.username : ""}
            category={channel.category}
          />
        );
      })}
      <div className="flex flex-row justify-between items-center px-2 mt-2">
        <Title icon={<Video size={20} />}>RECOMMEND CHANNELS</Title>
      </div>
      {recommendChannels.map((channel, idx) => {
        const user = userData.find((user) => user.id === channel.ownerId);
        return (
          <ChannelViewItem
            key={idx}
            name={user ? user.username : ""}
            category={channel.category}
          />
        );
      })}
    </div>
  );
};

const Title = ({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) => {
  return (
    <>
      <span className="font-semibold text-sm text-secondaryWord max-xl:hidden">
        {children}
      </span>
      <span className="font-semibold text-sm text-secondaryWord xl:hidden">
        {icon}
      </span>
    </>
  );
};
