"use client"
import React, { ReactNode, useId } from 'react'

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  optional?: boolean;
}

export default function TextArea({label, className, optional, ...props}: InputProps) {
  const id = useId();
  return (
    <div className="grid items-center gap-1.5">
      {label ? (
        <label
          htmlFor={id}
          className="font-inter font-medium text-sm text-text_header"
        >
          {label}{" "}
          {
            optional ? <span className='font-normal'>(Optional)</span> : null
          }
        </label>
      ) : null}
      <textarea
        rows={4}
        cols={50}
        id={id}
        className={`rounded-xl border border-gray_8 placeholder:text-[#848585] w-full px-[14px] py-4 outline-purple ${className}`}
        required={!optional}
        {...props}
      />
    </div>
  );
}
