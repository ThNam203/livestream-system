import { ClassValue } from "clsx";
import { format } from "date-fns";

export const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  if (seconds < 0) return "00:00";
  const time = new Date(seconds * 1000);
  if (seconds > 3600) return format(time, "HH:mm:ss");
  return format(time, "mm:ss");
};
