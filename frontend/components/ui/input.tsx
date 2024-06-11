"use client";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { ClassValue } from "clsx";
import { Search } from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessages?: string;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  showPasswordButton?: boolean;
}

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessages?: string;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  hasMaxLength?: boolean;
  maxLength?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      name,
      id,
      placeholder,
      label,
      errorMessages,
      showPasswordButton,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "font-semibold cursor-pointer mb-2",
            label ? "" : "hidden"
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          className={cn(
            "border-0 outline outline-1 outline-gray-400 rounded py-1 px-3 focus:outline-4 focus:outline-primary hover:outline-gray-500 hover:outline-2 font-normal",
            errorMessages ? "outline-red-500" : "",
            className
          )}
          {...props}
        />
        <span className="absolute -bottom-5 text-red-500 text-xs">
          {errorMessages ? errorMessages : ""}
        </span>
        <div
          className={cn(
            "absolute top-[110%] text-primary text-sm hover:underline hover:text-secondary cursor-pointer",
            showPasswordButton ? "" : "hidden"
          )}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

const InputWithIcon = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, id, label, errorMessages, iconAfter, iconBefore, ...props },
    ref
  ) => {
    return (
      <div className="relative w-full flex flex-col">
        <label
          htmlFor={id}
          className={cn(
            "font-semibold cursor-pointer mb-2",
            label ? "" : "hidden"
          )}
        >
          {label}
        </label>
        <div className="flex flex-row items-center border-0 outline outline-1 outline-black rounded px-3 focus-within:outline-4 focus-within:outline-primary">
          {iconBefore}
          <input
            ref={ref}
            id={id}
            className={cn(
              "flex-1 font-normal border-0 outline-0",
              errorMessages ? "outline-red-500" : "",
              className
            )}
            {...props}
          />
          {iconAfter}
        </div>

        <span className="absolute -bottom-5 text-red-500 text-xs">
          {errorMessages ? errorMessages : ""}
        </span>
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

const SearchInput = ({
  id,
  type = "text",
  popoverPosition = "bottom",
  popoverContent,
  placeholder,
  className,
}: {
  id?: string;
  type?: string;
  popoverPosition?: "bottom-start" | "bottom-end" | "bottom";
  popoverContent?: ReactNode;
  placeholder?: string;
  className?: ClassValue;
}) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover
      isOpen={showPopover}
      onOpenChange={setShowPopover}
      placement={popoverPosition}
      showArrow={true}
    >
      <PopoverTrigger>
        <div className={cn("relative flex flex-row items-center")}>
          <label
            htmlFor={id}
            className="absolute start-2 cursor-pointer font-normal"
          >
            <Search />
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={cn(
              "border-0 outline outline-1 outline-black rounded py-1 pl-10 pr-2 focus:outline-4 focus:outline-primary",
              className
            )}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white shadow-primaryShadow">
        <div
          className="max-h-[250px] overflow-y-scroll"
          onClick={() => setShowPopover(!showPopover)}
        >
          {popoverContent}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      name,
      id,
      placeholder,
      label,
      errorMessages,
      maxLength,
      onChange,
      hasMaxLength,
      value,
      ...props
    },
    ref
  ) => {
    const [length, setLength] = useState(0);
    useEffect(() => {
      if (value && typeof value === "string") setLength(value.length);
      console.log("value textarea", value);
    }, [value]);
    return (
      <div className="relative flex flex-col mb-2">
        <label
          htmlFor={id}
          className={cn(
            "font-semibold cursor-pointer mb-2",
            label ? "" : "hidden"
          )}
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={(e) => {
            setLength(e.target.value.length);
            if (onChange) onChange(e);
          }}
          className={cn(
            "border-0 outline outline-1 outline-gray-400 rounded py-1 px-3 focus:outline-4 focus:outline-primary hover:outline-gray-500 hover:outline-2 font-normal",
            errorMessages ? "outline-red-500" : "",
            className
          )}
          {...props}
        />
        <span className="absolute -bottom-5 text-red-500 text-xs">
          {errorMessages ? errorMessages : ""}
        </span>
        <span
          className={cn(
            "absolute -bottom-5 right-1 text-xs",
            hasMaxLength ? "" : "hidden"
          )}
        >
          {`${length}/${maxLength}`}
        </span>
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export { Input, InputWithIcon, SearchInput, TextArea };
