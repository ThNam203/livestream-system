"use client";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode, use, useEffect, useState } from "react";

const Tab = ({
  className,
  content,
  selectedTab,
  setSelectedTab,
  onClick,
}: {
  className?: ClassValue;
  content: string;
  selectedTab?: string;
  setSelectedTab: (selectedTab: string) => void;
  onClick?: () => void;
}) => {
  const selectedTabStyle = "text-secondary decoration-secondary";
  const defaultTabStyle = "text-primaryWord decoration-transparent";

  return (
    <span
      className={cn(
        "underline underline-offset-8 decoration-[1.5px] hover:text-primary ease-linear duration-100 cursor-pointer",
        selectedTab === content ? selectedTabStyle : defaultTabStyle,
        className
      )}
      onClick={() => {
        setSelectedTab(content);
        if (onClick) onClick();
      }}
    >
      {content}
    </span>
  );
};

const TabContent = ({
  className,
  contentFor,
  content,
  selectedTab,
}: {
  className?: ClassValue;
  contentFor?: string;
  content: ReactNode;
  selectedTab?: string;
}) => {
  return (
    <div
      className={cn(
        "",
        selectedTab === contentFor ? "visible" : "hidden",
        className
      )}
    >
      {content}
    </div>
  );
};

export { Tab, TabContent };
