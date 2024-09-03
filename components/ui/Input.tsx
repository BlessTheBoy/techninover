"use client";
import React, { ReactNode, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  optional?: boolean;
  error?: string;
}

export default function Input({
  label,
  className,
  optional,
  error,
  ...props
}: InputProps) {
  const id = useId();
  return (
    <div className="grid items-center gap-1.5">
      {label ? (
        <label
          htmlFor={id}
          className="font-inter font-medium text-sm text-text_header"
        >
          {label}{" "}
          {optional ? <span className="font-normal">(Optional)</span> : null}
        </label>
      ) : null}
      <input
        id={id}
        className={`h-12 rounded-xl border border-gray_8 placeholder:text-[#848585] w-full px-[14px] outline-purple ${className}`}
        required={!optional}
        {...props}
      />
      {error ? <p className="text-error text-xs">{error}</p> : null}
    </div>
  );
}
