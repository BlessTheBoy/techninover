
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import TaskCard from "@/components/ui/TaskCard";

export function SortableItem({task, active}: {task: Task, active: boolean}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      {active ? <div className="absolute w-full h-full z-10 bg-purple opacity-50 rounded-md" />: null}
      <TaskCard task={task} />
    </div>
  );
}
