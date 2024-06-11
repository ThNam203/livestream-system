"use client";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { TextButton } from "@/components/ui/buttons";
import { LoadingIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/auth";
import { setCookie } from "cookies-next";
import { setProfile } from "@/redux/slices/profile";

export type LoginFormData = {
  username: string;
  password: string;
};

const loginSchema: ZodType<LoginFormData> = z.object({
  username: z.string(),
  password: z.string(),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true);
    await AuthService.Login(data)
      .then((res) => {
        console.log("result", res.data);
        dispatch(setProfile(res.data.user));
        showSuccessToast("Login Successfully");
        router.push("/");
      })
      .catch((err) => {
        showErrorToast("Login Failed");
        console.log(err);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-screen h-screen flex items-center justify-center bg-white ">
        <div className="w-[500px] bg-white rounded-md shadow-[0_0_45px_-15px_rgba(0,0,0,0.3)] px-6 py-10 flex flex-col">
          <h1 className="w-full text-center text-2xl font-semibold">
            Log in to Twitch
          </h1>
          <div className="mt-6 flex flex-col gap-4">
            <Input
              id="username"
              label="Username"
              type="text"
              errorMessages={errors.username ? errors.username.message : ""}
              placeholder="Username"
              {...register("username")}
            />
            <Input
              id="password"
              label="Password"
              errorMessages={errors.password ? errors.password.message : ""}
              type="password"
              {...register("password")}
            />
          </div>
          <span className="mt-2">
            <a className="text-sm text-primary hover:underline cursor-pointer">
              Trouble logging in ?
            </a>
          </span>
          <TextButton
            type="submit"
            iconBefore={isLoggingIn ? <LoadingIcon /> : null}
            content={isLoggingIn ? "" : "Log In"}
            disabled={isLoggingIn}
            className="mt-6 text-sm font-bold text-white bg-primary hover:bg-primary/90"
          />
          <TextButton
            type="button"
            content="Don't have an account? Sign up"
            className="mt-4 font-bold text-primary bg-transparent hover:text-primaryWord disabled:bg-transparent disabled:text-primary"
            disabled={isLoggingIn}
            onClick={() => router.push("/register")}
          />
        </div>
      </div>
    </form>
  );
}
