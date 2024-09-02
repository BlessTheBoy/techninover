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
import { Task } from "@/types";
import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useState } from "react";

const allTasks: Task[] = [
  {
    priority: "high",
    id: 1,
    title: "Create a new design",
    status: "todo",
    cover: "/overflowing-bookcases.jpg",
    description:
      "Write a blog post outlining the top 10 productivity tips for busy professionals. The post should be engaging, informative, and include actionable advice. Target word count: 1,200 words.",
    deadline: "2024-08-31T13:34:43.051Z",
  },
  {
    id: 2,
    priority: "medium",
    title: "Home Renovation",
    description:
      "Write a blog post outlining the top 10 productivity tips for busy professionals.",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 3,
    priority: "high",
    title: "Organize a charity event",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 7,
    priority: "low",
    title: "Watch a Frontend Tutorial",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 8,
    priority: "medium",
    title: "Prep my week meal",
    cover: "/meal-prep.avif",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 10,
    priority: "medium",
    title: "Read a book",
    cover: "/books.avif",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 11,
    priority: "low",
    title: "Improve cards readability",
    description: "As a team license owner, I want to use multiplied limits",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 12,
    priority: "high",
    title: "Attend Standup and give updates",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
];

export default function Page({ params }: { params: { id: string } }) {
  const task = allTasks.find((task) => task.id === Number(params.id));
  if (!task) {
    notFound();
  }
  const [priority, setPriority] = useState<string | undefined>(task.priority);
  const [image, setImage] = useState<string | undefined>(task.cover);
  const [time, setTime] = useState<Date | undefined>(new Date(task.deadline));
  const [date, setDate] = useState<Date | undefined>(new Date(task.deadline));

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
          Edit Task
        </p>
      </div>
      <form className="pb-10 pt-10">
        <div className="space-y-5 mb-12">
          <Input
            label="Task Name"
            placeholder="Enter task name"
            defaultValue={task?.title}
          />
          <TextArea
            label="Description"
            placeholder="Enter task description"
            optional
            defaultValue={task?.description}
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
        <Button className="w-full">Save Edit</Button>
      </form>
    </main>
  );
}
