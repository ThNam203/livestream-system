"use client";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import default_banner from "@/public/images/default_banner.jpg";
import { Camera, User as UserUI } from "lucide-react";
import { RoundedIconButton } from "./buttons";

export const ChooseBannerButton = ({
  fileUrl,
  onImageChanged,
  className,
}: {
  fileUrl?: string;
  onImageChanged: (file: File | undefined) => void;
  className?: ClassValue;
}) => {
  const id = nanoid();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      onImageChanged(e.target.files[0]);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!fileUrl) {
      inputRef.current!.value = "";
    }
  }, [fileUrl]);

  return (
    <div
      className={cn(
        "w-[300px] h-[100px] relative border-none select-none flex items-center justify-center rounded-md overflow-hidden",
        className
      )}
    >
      <>
        <label
          htmlFor={id}
          className="absolute top-0 left-0 right-0 flex flex-row items-center justify-center w-full h-full cursor-pointer bg-gray-200/60 text-white opacity-0 hover:opacity-100 ease-linear duration-100"
        >
          <Camera />
        </label>
        <input
          ref={inputRef}
          id={id}
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="image/*"
        />

        {!fileUrl || fileUrl.length === 0 ? (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={default_banner}
            alt="banner"
            className="w-full h-full flex-shrink-0 object-cover overflow-hidden cursor-pointer"
          />
        ) : (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={fileUrl!}
            alt="image"
            className="w-full h-full flex-shrink-0 object-cover overflow-hidden cursor-pointer"
          />
        )}
      </>
    </div>
  );
};
