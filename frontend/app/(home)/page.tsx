"use client";

import { CustomLink } from "@/components/ui/hover_3d_box";
import { RecommendStreamingView } from "@/components/ui/recommend_streaming_view";
import { Separate } from "@/components/ui/separate";
import { streamings } from "@/fakedata/leftbar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [limitView, setLimitView] = useState<number[]>([4, 4, 4]);
  const handleShowMoreBtn = (index: number) => {
    const newLimitView = [...limitView];
    newLimitView[index] += 8;
    setLimitView(newLimitView);
  };

  return (
    <div className="flex flex-col w-full max-h-full p-8 overflow-y-scroll overflow-x-hidden">
      <div className="h-[600px] w-[300px] bg-red-300">
        {/* <Carousel />  */}
      </div>
      <RecommendStreamingView
        title={
          <span>
            <CustomLink content="Live channels" /> we think you&#39;ll like
          </span>
        }
        streamings={streamings}
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
        title={<span>Featured Clips We Think You&#39;ll Like</span>}
        streamings={streamings}
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

      <RecommendStreamingView
        title={
          <span>
            <CustomLink content="VTubers" />
          </span>
        }
        streamings={streamings}
        limitView={limitView[2]}
        separate={
          <div className="w-full flex flex-row items-center justify-between gap-4">
            <Separate />
            <button className="px-2 py-1 hover:bg-hoverColor hover:text-primaryWord rounded-md text-xs font-semibold text-primary flex flex-row items-center justify-center text-nowrap ease-linear duration-100">
              <span className="">Show all</span>
              <ChevronRight />
            </button>
            <Separate />
          </div>
        }
      />
    </div>
  );
}
