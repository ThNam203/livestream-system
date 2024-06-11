import { cn } from "@/utils/cn";
import { ClassValue } from "clsx";

export const LivestreamChatMessage = ({
  time,
  message,
  sender,
  type = "CHAT",
}: {
  time: string;
  sender: string;
  message: string;
  type: "JOIN" | "LEAVE" | "CHAT";
}) => {
  if (type === "JOIN") return <JoinMessage time={time} message={message} />;
  if (type === "LEAVE") return <LeaveMessage time={time} message={message} />;
  return <DefaultMessage time={time} message={message} sender={sender} />;
};

const wordColorList: ClassValue[] = [
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-pink-500",
  "text-purple-500",
  "text-indigo-500",
  "text-cyan-500",
  "text-teal-500",
  "text-emerald-500",
  "text-violet-500",
  "text-fuchsia-500",
  "text-lightBlue-500",
  "text-lime-500",
  "text-sky-500",
  "text-amber-500",
  "text-orange-500",
];

const DefaultMessage = ({
  time,
  message,
  sender,
}: {
  time: string;
  sender: string;
  message: string;
  colorIndex?: number;
}) => {
  return (
    <div className="flex flex-row items-center gap-2 px-2 cursor-pointer">
      <span className="text-secondaryWord">{time}</span>
      <span
        className={cn(
          "font-bold",
          wordColorList[sender.length % wordColorList.length]
        )}
      >
        {sender}:
      </span>
      <span className="text-primaryWord">{message}</span>
    </div>
  );
};

const JoinMessage = ({ time, message }: { time: string; message: string }) => {
  return (
    <div className="flex flex-row items-center gap-2 px-2 cursor-pointer rounded-md">
      <span className="text-secondaryWord">{time}</span>
      <span className={cn("font-bold text-secondaryWord")}>{message}</span>
    </div>
  );
};

const LeaveMessage = ({ time, message }: { time: string; message: string }) => {
  return (
    <div className="flex flex-row items-center gap-2 px-2 cursor-pointer rounded-md">
      <span className="text-secondaryWord">{time}</span>
      <span className={cn("font-bold text-red-500")}>{message}</span>
    </div>
  );
};
