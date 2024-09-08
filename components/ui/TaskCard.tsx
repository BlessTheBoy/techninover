"use client";

import { SortedTasks, Task } from "@/types";
import clsx from "clsx";
import React from "react";
import MoreHorizontal from "./svgs/more-horizontal";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import Image from "next/image";
import Flag from "./svgs/flag";
import moment from "moment";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import Link from "next/link";
import useSWRMutation from "swr/mutation";
import { useToast } from "@/hooks/use-toast";
import { preload } from "swr";

export default function TaskCard({
  task,
  attributes,
  listeners,
  overlay,
}: {
  task: Task;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  overlay?: boolean;
}) {
  preload(`${task.id}`, async () => {
    const res = await fetch(`/task/${task.id}`, {
      method: "get",
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    return result as Task;
  });

  const deadline = new Date(task.deadline);
  const { toast } = useToast();

  const currentDate = new Date();
  const { trigger, isMutating } = useSWRMutation(
    task.date,
    async () => {
      const res = await fetch(`/task/${task.id}`, {
        method: "delete",
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      return result;
    },
    {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error,
        });
      },
      optimisticData: (oldSortedTasks?: SortedTasks) => {
        if (!oldSortedTasks) {
          return {
            todo: [],
            "in-progress": [],
            completed: [],
          } as SortedTasks;
        }
        const newSortedTasks: SortedTasks = {
          ...oldSortedTasks,
          [task.status]: oldSortedTasks[task.status].filter(
            (t: Task) => t.id !== task.id
          ),
        };
        return newSortedTasks;
      },
      rollbackOnError: true,
      revalidate: true,
    }
  );

  return (
    <div
      id={String(task.id)}
      className={clsx(
        "space-y-4 p-4 rounded-md bg-white dark:bg-darkWhite dark:text-white shadow-card",
        {
          "cursor-move": overlay,
        }
      )}
      style={{
        background: "#171717",
      }}
    >
      <div {...attributes} {...listeners}>
        {task.priority ? (
          <p
            className={clsx(
              "h-6 px-2 rounded-[0.25rem] flex justify-center items-center font-inter font-medium text-xs w-fit",
              {
                "bg-success_bg dark:bg-success/20 text-success":
                  task.priority == "high",
              },
              {
                "bg-medium_bg dark:bg-medium/20 text-medium":
                  task.priority == "medium",
              },
              {
                "bg-error_bg dark:bg-error/20 text-error":
                  task.priority == "low",
              }
            )}
          >
            {task.priority.toUpperCase()}
          </p>
        ) : null}
      </div>
      <div className="space-y-4">
        <div className="flex items-end">
          <p
            className="font-sfPro font-medium text-base text-ellipsis line-clamp-2 text-text_header dark:text-darkText_header flex-1"
            {...attributes}
            {...listeners}
          >
            {task.title}
          </p>

          <Popover>
            <PopoverTrigger className="w-6 h-6 flex justify-center items-center border border-gray_6 dark:border-darkGray_6 hover:bg-gray-100 dark:hover:bg-darkGray_5 shadow-card rounded-md">
              <MoreHorizontal />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0 border border-gray_8 overflow-hidden">
              <Link
                href={`task/${task.id}/edit`}
                className="block w-full px-3 py-1 text-sm text-text_paragraph dark:text-darkText_paragraph text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Edit
              </Link>
              <button
                className={clsx(
                  "w-full px-3 py-1 text-sm text-danger text-left bg-white dark:bg-transparent dark:hover:bg-gray-800 hover:bg-gray-100",
                  {
                    "cursor-not-allowed opacity-50 bg-gray-100": isMutating,
                  }
                )}
                onClick={() => trigger()}
              >
                {isMutating ? "Deleting..." : "Delete"}
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
            className={`w-full h-auto rounded bg-gray-100 dark:bg-slate-800`}
            {...attributes}
            {...listeners}
          />
        ) : null}
        {task.description ? (
          <p
            className="text-sm tracking-tight text-ellipsis line-clamp-5 text-text_paragraph dark:text-darkText_paragraph opacity-75"
            {...attributes}
            {...listeners}
          >
            {task.description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2" {...attributes} {...listeners}>
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
