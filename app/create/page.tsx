"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import ImageUploader from "@/components/ui/ImageUploader";
import Input from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import LeftArrow from "@/components/ui/svgs/left-arrow";
import TextArea from "@/components/ui/TextArea";
import { TimePicker } from "@/components/ui/TimePicker";
import clsx from "clsx";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const [priority, setPriority] = useState<string | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [time, setTime] = useState<Date | undefined>();
  const [date, setDate] = useState<Date | undefined>();

  console.log("priority", priority);
  return (
    <main className="px-3 py-6 md:py-10 md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100"
        >
          <LeftArrow />
        </Link>
        <p className="font-sfPro font-semibold text-xl md:text-3xl grow md:flex-grow-0">
          Add Task
        </p>
      </div>
      <form className="pb-10 pt-10">
        <div className="space-y-5 mb-12">
          <Input label="Task Name" placeholder="Enter task name" />
          <TextArea
            label="Description"
            placeholder="Enter task description"
            optional
          />
          <div className="grid items-center gap-1.5">
            <label className="font-inter font-medium text-sm text-text_header">
              Priority
            </label>
            <Select onValueChange={setPriority}>
              <SelectTrigger className="h-12 rounded-xl border border-gray_8 placeholder:text-[#848585] w-full px-[14px] outline-purple">
                {priority ? (
                  <div
                    className={clsx(
                      "h-6 px-2 rounded-[0.25rem] flex justify-center items-center w-fit text-[#848585]",
                      {
                        "bg-success_bg text-success font-inter font-medium text-xs":
                          priority == "high",
                      },
                      {
                        "bg-medium_bg text-medium font-inter font-medium text-xs":
                          priority == "medium",
                      },
                      {
                        "bg-error_bg text-error font-inter font-medium text-xs":
                          priority == "low",
                      }
                    )}
                  >
                    {priority.toUpperCase()}
                  </div>
                ) : (
                  <span className="text-[#848585]">Select task priority</span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="high"
                    className="text-success hover:text-success hover:bg-success_bg"
                  >
                    High
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="text-medium hover:bg-medium_bg"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="low"
                    className="text-error hover:bg-error_bg"
                  >
                    Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ImageUploader
            image={image}
            setImage={setImage}
            label="Upload cover"
            optional
          />
          <div className="flex gap-4">
            <DatePicker label="Deadline" date={date} setDate={setDate} />
            <TimePicker label="Time" time={time} setTime={setTime} />
          </div>
        </div>
        <Button className="w-full">Add Task</Button>
      </form>
    </main>
  );
}
