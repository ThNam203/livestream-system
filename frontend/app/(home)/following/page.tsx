"use client";
import { ReactNode, useEffect, useState } from "react";
import gaming_svg from "../../../public/images/gaming.svg";
import creative_svg from "../../../public/images/creative.svg";
import esports_svg from "../../../public/images/esports.svg";
import irl_svg from "../../../public/images/irl.svg";
import music_svg from "../../../public/images/music.svg";
import Image from "next/image";
import { Tab, TabContent } from "@/components/ui/tab";
import { SearchInput } from "@/components/ui/input";
import { Combobox, Option } from "@/components/ui/combobox";
import { ArrowDownWideNarrow, ChevronDown, Sparkles, X } from "lucide-react";
import { categories } from "@/fakedata/browse";
import { cn } from "@/utils/cn";
import { fakeChannels, streamings } from "@/fakedata/leftbar";
import { CustomLink, Hover3DBox } from "@/components/ui/hover_3d_box";
import { TagButton } from "@/components/ui/buttons";
import { ClassValue } from "clsx";
import { Streaming } from "@/entities/channel";
import amongus_img from "../../../public/images/amongus.jpg";
import { RecommendStreamingView } from "@/components/ui/recommend_streaming_view";
import { Separate } from "@/components/ui/separate";

const BrowseItem = ({ title, icon }: { title: string; icon: any }) => {
  return (
    <div className="w-full relative bg-secondary rounded-md flex flex-row items-center justify-between px-4 py-2 cursor-pointer hover:bg-primary ease-linear duration-100">
      <h1 className="text-white font-bold text-2xl">{title}</h1>
      <div className="w-[80px]"></div>
      <Image
        src={icon}
        width={80}
        height={80}
        alt="Icon"
        className="absolute end-2"
      />
    </div>
  );
};

const CategoryContentView = ({
  title,
  viewers,
  tags,
}: {
  title: string;
  viewers: number;
  tags: string[];
}) => {
  return (
    <div className="flex-1 flex-col space-y-1">
      <span className="text-sm hover:text-primary cursor-pointer font-semibold">
        {title}
      </span>
      <div className="text-sm text-secondaryWord cursor-pointer">
        {viewers} viewers
      </div>
      <div className="flex flex-row gap-2 justify-self-end">
        {tags.map((tag, idx) => {
          return <TagButton key={idx} content={tag} />;
        })}
      </div>
    </div>
  );
};

const CategoryView = ({
  className,
  title,
  viewers,
  tags,
}: {
  className?: ClassValue;
  title: string;
  viewers: number;
  tags: string[];
}) => {
  return (
    <div className="flex flex-col">
      <Hover3DBox imageSrc={amongus_img} className="h-[260px]" />
      <CategoryContentView title={title} tags={tags} viewers={viewers} />
    </div>
  );
};

const CategoryListView = ({
  className,
  limitView,
  streamings,
}: {
  className?: ClassValue;
  limitView: number;
  streamings: Streaming[];
}) => {
  const streamingData = streamings.slice(0, limitView);
  return (
    <div
      className={cn(
        "w-full grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 gap-6",
        className
      )}
    >
      {streamingData.map((streaming, idx) => {
        return (
          <CategoryView
            key={idx}
            title={streaming.title}
            tags={streaming.tags}
            viewers={120}
          />
        );
      })}
    </div>
  );
};

export default function FollowingPage() {
  const browses: { title: string; icon: ReactNode }[] = [
    {
      title: "Games",
      icon: gaming_svg,
    },
    {
      title: "IRL",
      icon: irl_svg,
    },
    {
      title: "Music",
      icon: music_svg,
    },
    {
      title: "Esports",
      icon: esports_svg,
    },
    {
      title: "Creative",
      icon: creative_svg,
    },
  ];

  const [selectedTab, setSelectedTab] = useState("Overview");
  const [limitView, setLimitView] = useState<number[]>([4, 4, 4]);
  const handleShowMoreBtn = (index: number) => {
    const newLimitView = [...limitView];
    newLimitView[index] += 8;
    setLimitView(newLimitView);
  };

  return (
    <div className="w-full flex flex-col p-8 h-full overflow-y-scroll">
      <h1 className="text-5xl font-bold">Following</h1>
      <div className="w-full flex flex-row items-center gap-6 mt-6 max-sm:gap-3">
        <Tab
          content="Overview"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Tab
          content="Live"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Tab
          content="Videos"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Tab
          content="Categories"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Tab
          content="Channels"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      <TabContent
        contentFor="Overview"
        selectedTab={selectedTab}
        content={
          <div>
            <RecommendStreamingView
              title={<span>Live channels</span>}
              channels={fakeChannels}
              limitView={limitView[0]}
              separate={
                <div className="w-full flex flex-row items-center justify-between gap-4">
                  <Separate />
                  <button
                    className="px-2 py-1 hover:bg-hoverColor hover:text-primaryWord rounded-md text-xs font-semibold text-primary flex flex-row items-center justify-center text-nowrap ease-linear duration-100"
                    onClick={() => handleShowMoreBtn(0)}
                  >
                    <span className="">Show more</span>
                    <ChevronDown />
                  </button>
                  <Separate />
                </div>
              }
            />

            <RecommendStreamingView
              title={<span>Recommended channels</span>}
              channels={fakeChannels}
              limitView={limitView[1]}
              separate={
                <div className="w-full flex flex-row items-center justify-between gap-4">
                  <Separate />
                  <button
                    className="px-2 py-1 hover:bg-hoverColor hover:text-primaryWord rounded-md text-xs font-semibold text-primary flex flex-row items-center justify-center text-nowrap ease-linear duration-100"
                    onClick={() => handleShowMoreBtn(1)}
                  >
                    <span className="">Show more</span>
                    <ChevronDown />
                  </button>
                  <Separate />
                </div>
              }
            />
          </div>
        }
      />

      <TabContent
        contentFor="Live"
        selectedTab={selectedTab}
        content={
          <div className="h-40 flex items-center justify-center font-semibold text-2xl">
            Coming soon!
          </div>
        }
      />

      <TabContent
        contentFor="Videos"
        selectedTab={selectedTab}
        content={
          <div className="h-40 flex items-center justify-center font-semibold text-2xl">
            Coming soon!
          </div>
        }
      />
      <TabContent
        contentFor="Categories"
        selectedTab={selectedTab}
        content={
          <div className="h-40 flex items-center justify-center font-semibold text-2xl">
            Coming soon!
          </div>
        }
      />
      <TabContent
        contentFor="Channels"
        selectedTab={selectedTab}
        content={
          <div className="h-40 flex items-center justify-center font-semibold text-2xl">
            Coming soon!
          </div>
        }
      />
    </div>
  );
}
