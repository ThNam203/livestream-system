import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

const DefaultOption = ({
  className,
  content,
  onClick,
}: {
  className?: ClassValue;
  content: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <span
      className={cn(
        "text-sm hover:bg-hoverColor ease-linear duration-100 cursor-pointer pl-2 pr-[80px] py-1 rounded",
        className
      )}
      onClick={onClick}
    >
      {content}
    </span>
  );
};

export { DefaultOption };
