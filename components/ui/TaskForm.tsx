"use client";

import React, { useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import clsx from "clsx";
import ImageUploader from "./ImageUploader";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { Button } from "./button";
import { useSearchParams } from "next/navigation";

export default function TaskForm() {
  const searchParams = useSearchParams();
  const [status, setstatus] = useState<"todo" | "in-progress" | "completed">(
    (searchParams.get("status")?.toString() as
      | "todo"
      | "in-progress"
      | "completed") ?? "todo"
  );
  const [priority, setPriority] = useState<string | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [time, setTime] = useState<Date | undefined>();
  const [date, setDate] = useState<Date | undefined>();

  // console.log("priority", priority);
  return (
    <form className="pb-10">
      <div className="space-y-5 mb-12">
        <Input label="Task Name" placeholder="Enter task name" />
        <TextArea
          label="Description"
          placeholder="Enter task description"
          optional
        />
        <div className="grid items-center gap-1.5">
          <label className="font-inter font-medium text-sm text-text_header">
            Status
          </label>
          <Select
            onValueChange={(v) =>
              setstatus(v as "todo" | "in-progress" | "completed")
            }
            defaultValue={status}
          >
            <SelectTrigger className="h-12 rounded-xl border border-gray_8 placeholder:text-[#848585] w-full px-[14px] outline-purple">
              <SelectValue placeholder="Select task status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="todo"
                  className="text-error hover:bg-error_bg"
                >
                  To do
                </SelectItem>
                <SelectItem
                  value="in-progress"
                  className="text-medium hover:bg-medium_bg"
                >
                  In progress
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="text-success hover:text-success hover:bg-success_bg"
                >
                  Completed
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-center gap-1.5">
          <label className="font-inter font-medium text-sm text-text_header">
            Priority
          </label>
          <Select onValueChange={setPriority} defaultValue={priority}>
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
  );
}
