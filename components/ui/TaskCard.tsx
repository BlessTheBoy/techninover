import { Task } from "@/types";
import clsx from "clsx";
import React from "react";
import MoreHorizontal from "./svgs/more-horizontal";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import Image from "next/image";
import Flag from "./svgs/flag";
import moment from "moment";

// const c = new Date().toISOString();
// console.log(c);

export default function TaskCard({ task }: { task: Task }) {
  const deadline = new Date(task.deadline);
  const currentDate = new Date();

  return (
    <div className="p-4 rounded-md bg-white space-y-4 shadow-card">
      {task.priority ? (
        <p
          className={clsx(
            "h-6 px-2 rounded-[0.25rem] flex justify-center items-center font-inter font-medium text-xs w-fit",
            {
              "bg-success_bg text-success": task.priority == "high",
            },
            {
              "bg-medium_bg text-medium": task.priority == "medium",
            },
            {
              "bg-error_bg text-error": task.priority == "low",
            }
          )}
        >
          {task.priority.toUpperCase()}
        </p>
      ) : null}
      <div className="space-y-4">
        <div className="flex items-end">
          <p className="font-sfPro font-medium text-base text-ellipsis line-clamp-2 text-text_header flex-1">
            {task.title}
          </p>

          <Popover>
            <PopoverTrigger className="w-6 h-6 flex justify-center items-center border border-gray_6 hover:bg-gray-100 shadow-card rounded-md">
              <MoreHorizontal />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0 border border-gray_8">
              <button className="w-full px-3 py-1 text-sm text-text_paragraph text-left hover:bg-gray-100">
                Edit
              </button>
              <button className="w-full px-3 py-1 text-sm text-danger text-left hover:bg-gray-100">
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
        {task.cover ? (
          <Image
            src={task.cover}
            alt={task.title}
            width={800}
            height={400}
            className={`w-full h-auto rounded bg-gray-100`}
          />
        ) : null}
        {task.description ? (
          <p className="text-sm tracking-tight text-ellipsis line-clamp-5 text-text_paragraph opacity-75">
            {task.description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Flag
          className={clsx(
            {
              "fill-flagOrange": currentDate > deadline,
            },
            {
              "fill-success": task.status == "completed",
            }
          )}
        />
        <p className="font-medium text-sm text-text_paragraph2 flex-1 text-ellipsis line-clamp-1">
          {moment(task.deadline).format("MMMM Do YYYY")}
        </p>
        <p className="font-medium text-sm text-gray_7">
          {moment(task.deadline).format("h:mm a")}
        </p>
      </div>
    </div>
  );
}
