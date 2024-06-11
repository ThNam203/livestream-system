"use client";

import {
  IconButton,
  RoundedImageButton,
  TagButton,
} from "@/components/ui/buttons";
import { Hover3DBox } from "@/components/ui/hover_3d_box";
import { Streaming } from "@/entities/channel";
import { users } from "@/fakedata/leftbar";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { MoreVertical } from "lucide-react";
import { ReactNode } from "react";
import streaming_img from "../../public/images/live_user_zackrawrr-440x248.jpg";
import { socket_chat } from "@/socket_chat";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

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
  title,
  category,
  tags,
  channel,
  onClick,
}: {
  className?: ClassValue;
  viewers: number;
  title: string;
  tags: string[];
  category?: string;
  channel: string;
  onClick?: () => void;
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Hover3DBox
        viewers={viewers}
        showViewer={true}
        showStreaming={true}
        imageSrc={streaming_img}
        className="h-[170px]"
        onClick={onClick}
      />
      <ContentView
        channel={channel}
        title={title}
        category={category}
        tags={tags}
      />
    </div>
  );
};

const LiveChannelListView = ({
  limitView,
  streamings,
}: {
  limitView: number;
  streamings: Streaming[];
}) => {
  const router = useRouter();
  const streamingData = streamings.slice(0, limitView);
  return (
    <div className="w-full grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-1 gap-4">
      {streamingData.map((streaming, idx) => {
        const user = users.find((user) => user.id === streaming.ownerId);
        return (
          <LiveChannelView
            key={idx}
            channel={user ? user.username : ""}
            title={streaming.title}
            tags={streaming.tags}
            viewers={120}
            category={streaming.category}
            onClick={() => {
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
  streamings,
  limitView = 4,
  separate,
}: {
  title: ReactNode;
  streamings: Streaming[];
  limitView?: number;
  separate: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2 mt-8 pr-2">
      <div className="font-semibold text-lg">{title}</div>
      <LiveChannelListView limitView={limitView} streamings={streamings} />
      {separate}
    </div>
  );
};

export {
  ContentView,
  LiveChannelListView,
  LiveChannelView,
  RecommendStreamingView,
};
