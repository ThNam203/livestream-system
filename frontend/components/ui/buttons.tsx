"use client";
import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import Image from "next/image";
import React, { ReactNode } from "react";
import mrbeast_img from "../../public/images/mrbeast.jpg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
}

export interface TextButtonProps extends ButtonProps {
  iconBefore?: ReactNode;
  content?: string;
  iconAfter?: ReactNode;
}

export interface TagButtonProps extends ButtonProps {
  content: string;
}

export interface RoundedIconButtonProps extends ButtonProps {
  icon: ReactNode;
}

export interface RoundedImageButtonProps extends ButtonProps {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-8 h-8 hover:bg-hoverColor disabled:hover:bg-transparent disabled:text-secondaryWord rounded flex flex-row items-center justify-center",
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className, content, iconBefore, iconAfter, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-2 py-2 bg-gray-200 hover:bg-hoverColor disabled:bg-primary/60 rounded text-xs font-bold text-gray-500 flex flex-row items-center justify-center gap-2 ease-linear duration-100 cursor-pointer disabled:cursor-default",
          className
        )}
        {...props}
      >
        {iconBefore}
        {content}
        {children}
        {iconAfter}
      </button>
    );
  }
);
TextButton.displayName = "TextButton";

const TagButton = React.forwardRef<HTMLButtonElement, TagButtonProps>(
  ({ className, content, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-2 py-1 bg-gray-200 hover:bg-hoverColor disabled:hover:bg-transparent rounded-xl text-xs font-semibold text-gray-500 flex flex-row items-center justify-center cursor-pointer",
          className
        )}
        {...props}
      >
        {content}
      </button>
    );
  }
);
TagButton.displayName = "TagButton";

const RoundedIconButton = React.forwardRef<
  HTMLButtonElement,
  RoundedIconButtonProps
>(({ className, icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "w-8 h-8 rounded-full flex flex-row items-center justify-center outline-none",
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
});
RoundedIconButton.displayName = "RoundedIconButton";

const RoundedImageButton = ({ className }: { className?: ClassValue }) => {
  return (
    <Image
      width={500}
      height={500}
      className={cn(
        "h-8 w-8 rounded-full overflow-hidden cursor-pointer",
        className
      )}
      src={mrbeast_img}
      alt="mrbeast"
    />
  );
};

const OtherButtons = () => {
  return <button></button>;
};

export {
  IconButton,
  RoundedIconButton,
  RoundedImageButton,
  TagButton,
  TextButton,
};
