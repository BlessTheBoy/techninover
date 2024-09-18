'use client'

import Link from "next/link";
import React from "react";
import Plus from "./svgs/plus";
import TaskCard from "./TaskCard";
import { Task } from "@/types";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableItem } from "./SortableItem";
import { useSearchParams } from "next/navigation";

export default function CompletedColumn({
  completedTasks,
  activeId,
}: {
  completedTasks: Task[];
  activeId: number | undefined;
}) {
  const searchParams = useSearchParams();
  const taskDate = searchParams.get("date");
  const { setNodeRef } = useDroppable({ id: "completed" });
  return (
    <div className="px-2 py-3 rounded-lg bg-gray_5 dark:bg-darkGray_5 space-y-4 h-fit">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="font-inter font-medium text-base">Completed</p>
          {/* <div className="px-[6px] h-6 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-sm text-gray_7 flex justify-center items-center">
                {completedTasks.length}
              </div> */}
        </div>
        <Link
          href={
            taskDate
              ? `/create?status=completed&date=${taskDate}`
              : "/create?status=completed"
          }
          className="hover:bg-gray-200 rounded-[0.25rem]"
        >
          <Plus />
        </Link>
      </div>
      <SortableContext
        id={"completed"}
        items={completedTasks}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 gap-4 min-h-16" ref={setNodeRef}>
          {completedTasks.map((task) => (
            <SortableItem
              key={task.id}
              active={task.id == activeId}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
