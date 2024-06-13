"use client";
import { Channel } from "@/entities/channel";
import { User } from "@/entities/user";
import { setProfile } from "@/redux/slices/profile";
import AuthService from "@/services/authService";
import UserService from "@/services/userService";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { getCookie, setCookie } from "cookies-next";
import {
  Bell,
  Copy,
  Heart,
  Home,
  MessageSquare,
  MonitorX,
  MoreVertical,
  Podcast,
  User as UserUI,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconButton, RoundedIconButton, TextButton } from "./buttons";
import { LogoutIcon, SettingIcon } from "./icons";
import { SearchInput } from "./input";
import { DefaultOption } from "./option";
import { Separate } from "./separate";
import { showErrorToast, showSuccessToast } from "./toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setChannel } from "@/redux/slices/channel";
import { cn } from "@/utils/cn";
import ChannelService from "@/services/channelService";
import { socket_chat } from "@/socket_chat";

export const Header = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPopover, setShowPopover] = useState(false);
  const [thisUser, setThisUser] = useState<User>();
  const thisChannel = useAppSelector((state) => state.channel.value);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await UserService.getInfo()
        .then((res) => {
          setProfile(res);
          setThisUser(res);
        })
        .catch((err) => showErrorToast(err));
    };
    const fetchChannel = async () => {
      await ChannelService.getChannel()
        .then((res) => {
          dispatch(setChannel(res));
        })
        .catch((err) => showErrorToast(err));
    };
    const fetchData = async () => {
      await Promise.all([fetchUser(), fetchChannel()]);
    };
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));
  }, []);

  const handleStartStream = async (channel: Channel) => {
    await ChannelService.startLiveStream(channel.streamKey)
      .then((res) => {
        dispatch(setChannel(res));
      })
      .catch((err) => showErrorToast(err));
  };

  const handleEndStream = async (channel: Channel) => {
    await ChannelService.stopLiveStream(channel.streamKey)
      .then((res) => {
        dispatch(setChannel(res));
      })
      .catch((err) => showErrorToast(err));
  };

  return (
    <nav className="w-full h-12 flex flex-row items-center justify-between text-xl font-semibold text-primaryWord bg-white px-4 py-2 shadow z-[49]">
      <div className="flex flex-row md:gap-10 max-md:gap-4 items-center">
        <Link href="/" className="hover:text-primary">
          <span className="max-md:hidden">Home</span>
          <Home size={20} className="md:hidden" />
        </Link>
        <Link href="/following" className="hover:text-primary">
          <span className="max-md:hidden">Following</span>
          <Heart size={20} className="md:hidden" />
        </Link>
        <Link href="/browse" className="hover:text-primary">
          <span className="max-md:hidden">Browse</span>
          <Copy size={20} className="md:hidden" />
        </Link>
        <IconButton icon={<MoreVertical />} />
      </div>

      {/* <div className="lg:w-[400px] max-lg:w mx-2">
        <SearchInput
          id="search-input"
          placeholder="Search"
          className="text-base w-full"
        />
      </div> */}

      <div className={cn(isLoading && "opacity-0")}>
        {thisUser ? (
          <div className="flex flex-row gap-4">
            {thisChannel && thisChannel.liveStreaming && (
              <TextButton
                content="End stream"
                iconAfter={<MonitorX size={16} />}
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  handleEndStream(thisChannel);
                  socket_chat.disconnect();
                  setCookie("isStreaming", JSON.stringify(false));
                }}
              />
            )}

            {thisChannel && !thisChannel.liveStreaming && (
              <TextButton
                content="Stream now"
                iconAfter={<Podcast size={16} />}
                className="bg-primary hover:bg-secondary text-white"
                onClick={() => {
                  handleStartStream(thisChannel);
                  setCookie("isStreaming", JSON.stringify(true));
                  router.push("/livestreaming");
                }}
              />
            )}

            <IconButton icon={<Bell size={16} />} />
            <IconButton icon={<MessageSquare size={16} />} />

            <Popover
              isOpen={showPopover}
              onOpenChange={setShowPopover}
              placement="bottom-end"
              showArrow={true}
            >
              <PopoverTrigger>
                <RoundedIconButton
                  className="bg-[#69ffc3]"
                  icon={<UserUI size={16} strokeWidth={3} />}
                />
              </PopoverTrigger>
              <PopoverContent
                className="py-4 px-2 bg-white rounded-md shadow-primaryShadow flex flex-col items-start"
                onClick={(e) => e.preventDefault()}
              >
                <div className="flex flex-row gap-2 items-center justify-start select-none">
                  <RoundedIconButton
                    className="bg-[#69ffc3] w-8 h-8"
                    icon={<UserUI size={16} strokeWidth={3} />}
                  />
                  <span className="text-xs font-semibold">
                    {thisUser.username}
                  </span>
                </div>

                <Separate classname="my-2" />
                <DefaultOption
                  content={
                    <div className="flex flex-row gap-2 items-center">
                      <SettingIcon />
                      <span className="text-xs">Setting</span>
                    </div>
                  }
                  onClick={() => {
                    router.push("/setting");
                  }}
                />

                <Separate classname="my-2" />
                <DefaultOption
                  content={
                    <div className="flex flex-row gap-2 items-center text-red-500">
                      <LogoutIcon />
                      <span className="text-xs">Log Out</span>
                    </div>
                  }
                  onClick={async () => {
                    await AuthService.LogOut()
                      .then(() => {
                        showSuccessToast("Log out successfully");
                        router.push("/login");
                      })
                      .catch((err) => {
                        showErrorToast("Log out failed");
                        console.log(err);
                      })
                      .finally(() => {});
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <TextButton
              content="Log In"
              onClick={() => {
                router.push("/login");
              }}
              className="whitespace-nowrap"
            />
            <TextButton
              content="Sign Up"
              className="text-white bg-primary hover:bg-primary/80 whitespace-nowrap"
              onClick={() => {
                router.push("/register");
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
};
