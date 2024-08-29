import Link from "next/link";
import React from "react";
import Plus from "./svgs/plus";
import TaskCard from "./TaskCard";
import { Task } from "@/types";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

export default function TodoColumn({ todoTasks }: { todoTasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: "todo" });
  return (
    <div className="px-2 py-3 rounded-lg bg-gray_5 space-y-4 h-fit">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <p className="font-inter font-medium text-base">To do</p>
          <div className="px-[6px] h-6 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-sm text-gray_7 flex justify-center items-center">
            {todoTasks.length}
          </div>
        </div>
        <Link
          href="/create?status=todo"
          className="hover:bg-gray-200 rounded-[0.25rem]"
        >
          <Plus />
        </Link>
      </div>
      <SortableContext
        id={"todo"}
        items={todoTasks}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 gap-4" ref={setNodeRef}>
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
