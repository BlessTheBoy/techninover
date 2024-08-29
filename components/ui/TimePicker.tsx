"use client";

import * as React from "react";
import moment from "moment";
import clsx from "clsx";
import Clock from "./svgs/clock";

export function TimePicker({
  time,
  setTime,
  label,
  optional,
}: {
  time?: Date;
  setTime: (v: Date | undefined) => void;
  label?: React.ReactNode;
  optional?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="grid items-center gap-1.5 relative flex-1">
      {label ? (
        <label className="font-inter font-medium text-sm text-text_header">
          {label}{" "}
          {optional ? <span className="font-normal">(Optional)</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={inputRef}
          type="time"
          // className="hidden"
          className="absolute w-0 h-0 cursor-pointer"
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":");
            const newTime = new Date();
            newTime.setHours(parseInt(hours));
            newTime.setMinutes(parseInt(minutes));
            setTime(newTime);
          }}
        />
        <div
          className={clsx(
            "h-12 rounded-xl border border-gray_8 w-full px-[14px] z-0 outline-purple flex gap-2 items-center cursor-pointer select-none",
            {
              "text-[#848585]": !time,
            }
          )}
          onClick={() => inputRef.current?.showPicker()}
        >
          <p className="flex-1">
            {time ? moment(time).format("h:mm a") : "Select time"}
          </p>
          <Clock />
        </div>
      </div>
    </div>
  );
}
