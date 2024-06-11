"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ClassValue } from "clsx";

const Hover3DBox = ({
  className,
  imageSrc,
  viewers = 0,
  showViewer = false,
  showStreaming = false,
  onClick,
}: {
  className?: ClassValue;
  imageSrc: StaticImport | string;
  viewers?: number;
  showViewer?: boolean;
  showStreaming?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn("relative w-full h-full bg-primary z-0 group", className)}
      onClick={onClick}
    >
      <div className="absolute left-0 top-0 w-2 h-full skew-y-[0deg] bg-primary group-hover:skew-y-[-45deg] group-hover:top-[-0.25rem] ease-linear duration-100"></div>
      <div className="absolute bottom-0 right-0 w-full h-2 skew-x-[0deg] bg-primary group-hover:skew-x-[-45deg] group-hover:right-[-0.25rem] ease-linear duration-100"></div>
      <Image
        width={500}
        height={500}
        src={imageSrc}
        alt="streaming"
        className="absolute w-full h-full top-0 left-0 z-10 group-hover:translate-x-2 group-hover:-translate-y-2 ease-linear duration-100 cursor-pointer"
      />
      <span
        className={cn(
          "absolute text-white bg-red-600 rounded p-1 top-2 left-2 z-20 group-hover:translate-x-2 group-hover:-translate-y-2 ease-linear duration-100",
          showStreaming ? "" : "hidden"
        )}
      >
        LIVE
      </span>
      <span
        className={cn(
          "absolute px-1 rounded-sm text-white text-sm bg-black/60 bottom-2 left-2 z-20 group-hover:translate-x-2 group-hover:-translate-y-2 ease-linear duration-100",
          showViewer ? "" : "hidden"
        )}
      >
        {viewers} viewers
      </span>
    </div>
  );
};

const CustomLink = ({
  content,
  href = "/",
}: {
  content: string;
  href?: string;
}) => {
  return (
    <a
      href={href}
      className="text-primary opacity-100 hover:opacity-90 hover:underline underline-offset-2"
    >
      {content}
    </a>
  );
};

export { CustomLink, Hover3DBox };
