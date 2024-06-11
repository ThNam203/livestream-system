import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { X } from "lucide-react";
import React, { ReactNode } from "react";

const Tag = ({
  children,
  className,
  onDelete,
}: {
  children: ReactNode;
  className?: ClassValue;
  onDelete: () => void;
}) => {
  return (
    <span
      className={cn(
        "flex flex-row items-center gap-2 bg-gray-200 rounded-3xl px-3 py-1 text-secondaryWord font-semibold text-sm",
        className
      )}
    >
      {children}
      <X
        size={16}
        strokeWidth={3}
        className="cursor-pointer hover:opacity-80"
        onClick={() => onDelete()}
      />
    </span>
  );
};

export default Tag;
