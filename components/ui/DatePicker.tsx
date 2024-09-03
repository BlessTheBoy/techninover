"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import clsx from "clsx";
import CalendarIcon from "./svgs/calendar";

export function DatePicker({
  date,
  setDate,
  label,
  optional,
  error
}: {
  date?: Date;
  setDate: (v: Date | undefined) => void;
  label?: React.ReactNode;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div className="grid items-center gap-1.5 relative flex-1">
      {label ? (
        <label className="font-inter font-medium text-sm text-text_header">
          {label}{" "}
          {optional ? <span className="font-normal">(Optional)</span> : null}
        </label>
      ) : null}
      <Popover>
        <PopoverTrigger>
          <div
            className={clsx(
              "h-12 rounded-xl border border-gray_8 w-full px-[14px] outline-purple flex gap-2 items-center cursor-pointer select-none z-0",
              {
                "text-[#848585]": !date,
              }
            )}
          >
            <p className="flex-1 text-left">
              {date ? moment(date).format("MMMM Do YYYY") : "Select date"}
            </p>
            <CalendarIcon />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error ? <p className="text-error text-xs">{error}</p> : null}
    </div>
  );
}
