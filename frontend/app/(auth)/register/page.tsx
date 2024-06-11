"use client";

import {
  showDefaultToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/ui/toast";
import { IconButton, TextButton } from "@/components/ui/buttons";
import { LoadingIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/auth";
import { setCookie } from "cookies-next";
import { setProfile } from "@/redux/slices/profile";

export type RegisterFormData = {
  username: string;
  password: string;
  confirmPassword: string;
  birth: Date;
  email: string;
};

const registerSchema: ZodType<RegisterFormData> = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    birth: z.date(),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsSigningUp(true);
    await AuthService.Register(data)
      .then((res) => {
        showSuccessToast("Sign Up Success");
        dispatch(setProfile(res.data.user));
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        showErrorToast(err.response.data.message || "Sign Up Failed");
      })
      .finally(() => {
        setIsSigningUp(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-screen h-screen flex items-center justify-center bg-white ">
        <div className="relative w-[500px] bg-white rounded-md shadow-[0_0_45px_-15px_rgba(0,0,0,0.3)] px-6 py-10 flex flex-col">
          <IconButton
            className="absolute top-2 left-2"
            type="button"
            icon={<ArrowLeftFromLine size={18} />}
            onClick={() => router.push("/login")}
          />
          <h1 className="w-full text-center text-2xl font-semibold">
            Join Twitch today
          </h1>
          <div className="mt-6 flex flex-col gap-6">
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
            <Input
              id="confirm-password"
              label="Confirm Password"
              type="password"
              errorMessages={
                errors.confirmPassword ? errors.confirmPassword.message : ""
              }
              {...register("confirmPassword")}
            />
            <Input
              id="month"
              label="Date of Birth"
              type="date"
              errorMessages={errors.birth ? errors.birth.message : ""}
              {...register("birth", { valueAsDate: true })}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="example@gmail.com"
              errorMessages={errors.email ? errors.email.message : ""}
              {...register("email")}
            />
          </div>
          <TextButton
            type="submit"
            iconBefore={isSigningUp ? <LoadingIcon /> : null}
            content={isSigningUp ? "" : "Sign Up"}
            className="mt-10 text-sm font-bold text-white bg-primary hover:bg-primary/90"
            disabled={isSigningUp}
          />
        </div>
      </div>
    </form>
  );
}
