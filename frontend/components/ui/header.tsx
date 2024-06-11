"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import {
  Bell,
  Copy,
  Heart,
  Home,
  MessageSquare,
  MoreVertical,
  Podcast,
  User as UserUI,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconButton, RoundedIconButton, TextButton } from "./buttons";
import { SearchInput } from "./input";
import { Separate } from "./separate";
import { LogoutIcon, SettingIcon } from "./icons";
import { DefaultOption } from "./option";
import { use, useEffect, useState } from "react";
import AuthService from "@/services/authService";
import { showErrorToast, showSuccessToast } from "./toast";
import { getCookie, setCookie } from "cookies-next";
import { useAppSelector } from "@/redux/hooks";
import UserService from "@/services/userService";
import { setProfile } from "@/redux/slices/profile";
import { User } from "@/entities/user";

export const Header = () => {
  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);
  const [thisUser, setThisUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await UserService.getInfo()
        .then((res) => {
          setProfile(res);
          setThisUser(res);
        })
        .catch((err) => showErrorToast(err));
    };
    if (!thisUser) fetchData();
  }, [thisUser]);

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

      <div className="lg:w-[400px] max-lg:w mx-2">
        <SearchInput
          id="search-input"
          placeholder="Search"
          className="text-base w-full"
        />
      </div>

      {thisUser ? (
        <div className="flex flex-row gap-4">
          <TextButton
            content="Stream now"
            iconAfter={<Podcast size={16} />}
            className="bg-primary hover:bg-secondary text-white"
            onClick={() => {
              setCookie("isStreaming", JSON.stringify(true));
              router.push("/livestreaming");
            }}
          />
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
            <PopoverContent>
              <div
                className="py-4 px-2 bg-white rounded-md shadow-primaryShadow flex flex-col"
                onClick={() => setShowPopover(false)}
              >
                <div className="flex flex-row gap-2 items-center">
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
              </div>
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
    </nav>
  );
};
