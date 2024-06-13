"use client";
import { TextButton } from "@/components/ui/buttons";
import { ChooseAvatarButton } from "@/components/ui/choose_avatar_button";
import { ChooseBannerButton } from "@/components/ui/choose_banner_button copy";
import { Input, TextArea } from "@/components/ui/input";
import { Separate } from "@/components/ui/separate";
import { Tab, TabContent } from "@/components/ui/tab";
import Tag from "@/components/ui/tag";
import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/toast";
import { User } from "@/entities/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/profile";
import UserService, { UpdateProfileProps } from "@/services/userService";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassValue } from "clsx";
import { format } from "date-fns";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { Radio, RadioGroup } from "@nextui-org/react";
import { Channel } from "@/entities/channel";
import { setChannel, updateStreamKey } from "@/redux/slices/channel";
import ChannelService from "@/services/channelService";

export type UpdateProfileFormData = {
  username: string;
  email: string;
  bio: string;
  birth: Date;
  oldPassword?: string | undefined;
  newPassword?: string | undefined;
};

export type UpdateChannelFormData = {
  channelName: string;
  title: string;
  tags: string[];
  enableLLHLS: boolean;
};

const updateProfileSchema: ZodType<UpdateProfileFormData> = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    bio: z.string().max(300),
    birth: z.date(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at lease 8 characters" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.oldPassword) return data.newPassword !== undefined;
      return true;
    },
    { message: "New password is empty", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword) return data.oldPassword !== undefined;
      return true;
    },
    { message: "Old password is empty", path: ["oldPassword"] }
  );

const updateChannelSchema: ZodType<UpdateChannelFormData> = z.object({
  channelName: z
    .string()
    .min(1, { message: "Channel name must be at least 1 character" }),
  title: z.string().max(140),
  tags: z.array(z.string().min(1)),
  enableLLHLS: z.boolean(),
});

export default function SettingPage() {
  const [thisUser, setThisUser] = useState<User>();
  const [thisChannel, setThisChannel] = useState<Channel>();

  const [selectedTab, setSelectedTab] = useState("Profile");
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [bannerUrl, setBannerUrl] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const handleAvatarChanged = (file: File | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    } else {
      setAvatarUrl(undefined);
    }
  };
  const handleBannerChanged = (file: File | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerUrl(url);
    } else {
      setBannerUrl(undefined);
    }
  };

  const updateProfileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      birth: new Date(),
      bio: "",
      email: "",
      username: "",
      oldPassword: undefined,
      newPassword: undefined,
    },
  });
  const {
    watch: watchProfile,
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
  } = updateProfileForm;

  const updateChannelForm = useForm<UpdateChannelFormData>({
    resolver: zodResolver(updateChannelSchema),
    defaultValues: {
      channelName: "",
      title: "",
      tags: [],
      enableLLHLS: true,
    },
  });
  const {
    register: registerChannel,
    handleSubmit: handleSubmitChannel,
    watch: watchChannel,
    formState: { errors: errorsChannel },
  } = updateChannelForm;

  const handleUpdateProfile = async (data: UpdateProfileFormData) => {
    const profileToUpdate: UpdateProfileProps = {
      username: data.username ? data.username : "",
      email: data.email ? data.email : "",
      bio: data.bio ? data.bio : "",
      birth: data.birth ? data.birth.toISOString() : new Date().toISOString(),
    };
    await UserService.updateProfile(profileToUpdate)
      .then((res) => {
        setThisUser(res);
        showSuccessToast("Profile updated successfully");
      })
      .catch((err) => showErrorToast(err));
    if (data.oldPassword && data.newPassword) {
      await UserService.updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
        .then(() => showSuccessToast("Password updated successfully"))
        .catch((err) => showErrorToast(err));
    }
  };

  const handleUpdateChannel = (data: UpdateChannelFormData) => {
    ChannelService.updateChannel(data)
      .then(() => showSuccessToast("Channel updated successfully"))
      .catch((err) => showErrorToast(err));
  };

  const handleResetStreamKey = async () => {
    await ChannelService.updateStreamKey()
      .then((res) => {
        if (thisChannel) {
          setThisChannel({ ...thisChannel, streamKey: res });
          showSuccessToast("Stream key reset successfully");
        }
      })
      .catch((err) => showErrorToast(err));
  };

  const initProfile = (user: User) => {
    updateProfileForm.setValue("username", user.username);
    updateProfileForm.setValue("email", user.email);
    updateProfileForm.setValue("bio", user.bio);
    updateProfileForm.setValue("birth", user.birth);
  };

  const initChannel = (channel: Channel) => {
    updateChannelForm.setValue("channelName", channel.channelName);
    updateChannelForm.setValue("title", channel.title);
    updateChannelForm.setValue("tags", channel.tags);
    updateChannelForm.setValue("enableLLHLS", channel.enableLLHLS);
  };

  useEffect(() => {
    const fetchChannel = async () => {
      await ChannelService.getChannel().then((res) => {
        console.log(res);
        setThisChannel(res);
      });
    };
    const fetchUser = async () => {
      await UserService.getInfo().then((res) => {
        setThisUser(res);
      });
    };
    const fetchData = async () => {
      await Promise.all([fetchChannel(), fetchUser()])
        .then(() => {})
        .catch((err) => showErrorToast(err));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (thisUser) initProfile(thisUser);
  }, [thisUser]);

  useEffect(() => {
    if (thisChannel) initChannel(thisChannel);
    console.log("use effect", thisChannel);
  }, [thisChannel]);

  return (
    <div className="w-full h-screen flex flex-col p-8 pb-20 overflow-y-scroll">
      <h1 className="text-3xl font-bold">Setting</h1>
      <div className="w-full flex flex-row items-center gap-6 mt-6 max-sm:gap-3 border-b pb-[1.5px]">
        <Tab
          content="Profile"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        <Tab
          content="Channel"
          className="text-lg font-semibold"
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      <TabContent
        contentFor="Profile"
        selectedTab={selectedTab}
        className="pt-6"
        content={
          <form
            onSubmit={handleSubmitProfile(handleUpdateProfile)}
            className="flex flex-col gap-6"
          >
            <div className="w-full flex flex-col font-sans text-primaryWord gap-4">
              <h1 className="font-semibold text-xl">Profile info</h1>
              <div className="max-w-4xl border border-gray-200 bg-white rounded-md">
                <div className="w-full flex flex-row items-center justify-center sm:gap-10 max-sm:gap-2 py-2 px-2">
                  <ChooseAvatarButton
                    fileUrl={avatarUrl}
                    onImageChanged={handleAvatarChanged}
                  />

                  <ChooseBannerButton
                    fileUrl={bannerUrl}
                    onImageChanged={handleBannerChanged}
                  />
                </div>
                <Separate />

                <RowInfo title="Bio">
                  <div className="flex flex-col w-full gap-4">
                    <TextArea
                      className="h-[60px] resize-none"
                      hasMaxLength={true}
                      maxLength={300}
                      value={watchProfile("bio") ? watchProfile("bio") : ""}
                      {...registerProfile("bio")}
                      errorMessages={
                        errorsProfile && errorsProfile.bio
                          ? errorsProfile.bio.message
                          : ""
                      }
                    />
                    <span className="text-secondaryWord">
                      Description for the About panel on your channel page in
                      under 300 characters
                    </span>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Birthdate">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      id="month"
                      type="date"
                      value={
                        watchProfile("birth")
                          ? format(watchProfile("birth") as Date, "yyyy-MM-dd")
                          : ""
                      }
                      {...registerProfile("birth", { valueAsDate: true })}
                      errorMessages={
                        errorsProfile && errorsProfile.birth
                          ? errorsProfile.birth.message
                          : ""
                      }
                    />

                    <span className="text-secondaryWord">
                      Change your birthdate here
                    </span>
                  </div>
                </RowInfo>
              </div>
            </div>
            <div className="w-full flex flex-col font-sans text-primaryWord gap-4">
              <h1 className="font-semibold text-xl">Account info</h1>
              <Border>
                <RowInfo title="Username">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      {...registerProfile("username")}
                      errorMessages={
                        errorsProfile && errorsProfile.username
                          ? errorsProfile.username.message
                          : ""
                      }
                    />
                    <span className="text-secondaryWord">
                      You may update your username
                    </span>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Email">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      type="email"
                      {...registerProfile("email")}
                      errorMessages={
                        errorsProfile && errorsProfile.email
                          ? errorsProfile.email.message
                          : ""
                      }
                    />
                    <span className="text-secondaryWord">
                      You may update your email here
                    </span>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Old Password">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      type="password"
                      value={watchProfile("oldPassword")}
                      errorMessages={
                        errorsProfile && errorsProfile.oldPassword
                          ? errorsProfile.oldPassword.message
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value === "") {
                          updateProfileForm.setValue("oldPassword", undefined);
                        } else {
                          updateProfileForm.setValue(
                            "oldPassword",
                            e.target.value
                          );
                        }
                      }}
                    />
                    <span className="text-secondaryWord">
                      Type your old password here
                    </span>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Password">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      type="password"
                      value={watchProfile("newPassword")}
                      errorMessages={
                        errorsProfile && errorsProfile.newPassword
                          ? errorsProfile.newPassword.message
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value === "") {
                          updateProfileForm.setValue("newPassword", undefined);
                        } else {
                          updateProfileForm.setValue(
                            "newPassword",
                            e.target.value
                          );
                        }
                      }}
                    />
                    <span className="text-secondaryWord">
                      Type your new password here
                    </span>
                  </div>
                </RowInfo>
                <Separate />

                <RowInfo className="bg-gray-100">
                  <div className="flex flex-row justify-end">
                    <TextButton
                      type="submit"
                      onClick={() => {
                        console.log(updateProfileForm.getValues());
                        try {
                          console.log(
                            updateProfileSchema.safeParse(
                              updateProfileForm.getValues()
                            )
                          );
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                      className="bg-primary hover:bg-secondary text-white disabled:bg-gray-200 disabled:text-gray-400 select-none"
                    >
                      Save changes
                    </TextButton>
                  </div>
                </RowInfo>
              </Border>
            </div>
          </form>
        }
      />
      <TabContent
        contentFor="Channel"
        selectedTab={selectedTab}
        className="pt-6"
        content={
          <form
            onSubmit={handleSubmitChannel(handleUpdateChannel)}
            className="flex flex-col gap-6"
          >
            <div className="w-full flex flex-col font-sans text-primaryWord gap-4">
              <h1 className="font-semibold text-xl">Stream config</h1>
              <Border>
                <RowInfo title="Private stream key" className="pb-8">
                  <div className="flex flex-row w-full gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="password"
                        value={thisChannel ? thisChannel.streamKey : ""}
                        onChange={() => {
                          return;
                        }}
                        showPasswordButton={true}
                      />
                    </div>
                    <TextButton
                      className="bg-primary text-white hover:bg-secondary"
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          thisChannel ? thisChannel.streamKey : ""
                        );
                        showDefaultToast("Copied to clipboard");
                      }}
                    >
                      Copy
                    </TextButton>
                    <TextButton
                      type="button"
                      onClick={() => handleResetStreamKey()}
                    >
                      Reset
                    </TextButton>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Latency mode">
                  <div className="h-fit flex-1">
                    <RadioGroup
                      color="primary"
                      value={
                        watchChannel("enableLLHLS") === false
                          ? "ll-hls-none"
                          : "ll-hls"
                      }
                      onValueChange={(value) => {
                        updateChannelForm.setValue(
                          "enableLLHLS",
                          value === "ll-hls"
                        );
                      }}
                    >
                      <Radio value="ll-hls">
                        Low latency: Best for near real-time interactions with
                        viewers
                      </Radio>
                      <Radio value="ll-hls-none">
                        Normal latency: Enable this setting if you do not
                        interact with viewers in real-time
                      </Radio>
                    </RadioGroup>
                  </div>
                </RowInfo>
              </Border>
            </div>
            <div className="w-full flex flex-col font-sans text-primaryWord gap-4">
              <h1 className="font-semibold text-xl">Stream info</h1>
              <Border>
                <RowInfo title="Channel Name">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      {...registerChannel("channelName")}
                      errorMessages={
                        errorsChannel && errorsChannel.channelName
                          ? errorsChannel.channelName.message
                          : ""
                      }
                    />
                    <span className="text-secondaryWord">
                      Customize capitalization for your name
                    </span>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Title">
                  <div className="flex flex-col w-full gap-4">
                    <TextArea
                      hasMaxLength={true}
                      maxLength={140}
                      className="resize-none"
                      errorMessages={
                        errorsChannel && errorsChannel.title
                          ? errorsChannel.title.message
                          : ""
                      }
                      value={watchChannel("title") ? watchChannel("title") : ""}
                      {...registerChannel("title")}
                    />
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo title="Tags">
                  <div className="flex flex-col w-full gap-4">
                    <Input
                      errorMessages={
                        errorsChannel && errorsChannel.tags
                          ? errorsChannel.tags.message
                          : ""
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (e.currentTarget.value.length === 0) return;
                          if (tags.includes(e.currentTarget.value)) {
                            showDefaultToast("Tag already exists");
                            return;
                          }
                          setTags([...tags, e.currentTarget.value]);
                          updateChannelForm.setValue("tags", [
                            ...tags,
                            e.currentTarget.value,
                          ]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <div className="w-full flex flex-wrap flex-row gap-2">
                      {watchChannel("tags").map((tag, idx) => {
                        return (
                          <Tag
                            key={idx}
                            onDelete={() => {
                              setTags(tags.filter((t) => t !== tag));
                              updateChannelForm.setValue(
                                "tags",
                                tags.filter((t) => t !== tag)
                              );
                            }}
                          >
                            {tag}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                </RowInfo>
                <Separate />
                <RowInfo className="bg-gray-100">
                  <div className="flex flex-row justify-end">
                    <TextButton className="bg-primary hover:bg-secondary text-white disabled:bg-gray-200 disabled:text-gray-400 select-none">
                      Save changes
                    </TextButton>
                  </div>
                </RowInfo>
              </Border>
            </div>
          </form>
        }
      />
    </div>
  );
}

const Border = ({ children }: { children?: ReactNode[] | ReactNode }) => {
  return (
    <div className="max-w-4xl border border-gray-200 bg-transparent rounded-md max-sm:w-[80vw]">
      {children}
    </div>
  );
};

const RowInfo = ({
  title,
  children,
  className,
}: {
  title?: string;
  children?: ReactNode | ReactNode[];
  className?: ClassValue;
}) => {
  return (
    <div className={cn("p-4 flex flex-row h-fit", className)}>
      <span
        className={cn(
          "w-[150px] font-semibold",
          title && title.length > 0 ? "" : "hidden"
        )}
      >
        {title}
      </span>

      <div className="h-fit flex-1">{children}</div>
    </div>
  );
};
