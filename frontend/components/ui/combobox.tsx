"use client";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { ClassValue } from "clsx";
import {
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

const Option = ({
  className,
  icon,
  content,
  selectedOption,
  setSelectedOption,
  onClick,
}: {
  className?: ClassValue;
  icon?: ReactNode;
  content: string;
  selectedOption?: string;
  setSelectedOption: (selectedTab: string) => void;
  onClick?: () => void;
}) => {
  const selectedStyle = "bg-primary text-white";
  const defaultStyle = "bg-white text-primaryWord hover:bg-hoverColor";
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center justify-between text-nowrap rounded px-2 py-1 gap-2 cursor-pointer ease-linear duration-100",
        selectedOption === content ? selectedStyle : defaultStyle,
        className
      )}
      onClick={() => {
        setSelectedOption(content);
        if (onClick) onClick();
      }}
    >
      {icon}
      <span className="w-full">{content}</span>
      <Check
        className={cn(selectedOption === content ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
};

const Combobox = ({
  selectedOption,
  className,
  popoverContent,
  popoverPosition = "bottom",
  hasArrowAfter = true,
}: {
  selectedOption: string;
  popoverContent?: ReactNode;
  popoverPosition?:
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  className?: ClassValue;
  hasArrowAfter?: boolean;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover
      isOpen={showPopover}
      onOpenChange={() => setShowPopover(!showPopover)}
      placement={popoverPosition}
      showArrow={true}
    >
      <PopoverTrigger onAnimationStart={(e) => e.preventDefault()}>
        <div className={cn("relative flex flex-row items-center")}>
          <div
            className={cn(
              "min-h-8 border-0 outline outline-1 outline-black rounded py-1 pl-3 pr-10 text-nowrap bg-white",
              showPopover ? "outline-4 outline-primary" : "",
              className
            )}
          >
            {selectedOption}
          </div>
          {hasArrowAfter && (
            <span className="absolute end-2 cursor-pointer font-normal">
              {showPopover ? <ChevronUp /> : <ChevronDown />}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-2 rounded-md bg-white shadow-primaryShadow">
        <div
          className="overflow-y-hidden"
          onClick={() => setShowPopover(!showPopover)}
        >
          {popoverContent}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { Combobox, Option };
