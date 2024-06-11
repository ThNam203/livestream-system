import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";

const Separate = ({
  color = "bg-gray-200",
  classname,
}: {
  classname?: ClassValue;
  color?: string;
  height?: string;
}) => {
  return <div className={cn("h-[0.5px] w-full", color, classname)}></div>;
};

export { Separate };
