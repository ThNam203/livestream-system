import { IconButton } from "@/components/ui/buttons";
import { ArrowRightFromLine, Users } from "lucide-react";

//Lỡ làm lười xóa
export default function DetailPage() {
  return (
    <div className="h-full w-full flex flex-row items-center justify-between">
      <div className="flex-1 flex-col justify-start items-start">
        Streaming Area
      </div>
      <div className="w-80 flex flex-col justify-self-end">
        <div className="flex flex-row justify-between items-center px-2">
          <IconButton icon={<ArrowRightFromLine size={18} />} />
          <span className="font-semibold text-lg">STREAM CHAT</span>
          <IconButton icon={<Users size={18} />} />
        </div>
      </div>
    </div>
  );
}
