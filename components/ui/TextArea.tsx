"use client"
import React, { ReactNode, useId } from 'react'

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  optional?: boolean;
  error?: string;
}

export default function TextArea({label, className, optional, error, ...props}: InputProps) {
  const id = useId();
  return (
    <div className="grid items-center gap-1.5">
      {label ? (
        <label
          htmlFor={id}
          className="font-inter font-medium text-sm text-text_header dark:text-darkText_header"
        >
          {label}{" "}
          {optional ? <span className="font-normal">(Optional)</span> : null}
        </label>
      ) : null}
      <textarea
        rows={4}
        cols={50}
        id={id}
        className={`rounded-xl border border-gray_8 placeholder:text-[#848585] dark:border-darkGray_8 dark:bg-darkWhite w-full px-[14px] py-4 outline-purple dark:focus:border-purple dark:outline-none ${className}`}
        required={!optional}
        {...props}
      />
      {error ? <p className="text-error text-xs">{error}</p> : null}
    </div>
  );
}
