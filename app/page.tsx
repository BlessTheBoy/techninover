"use client";

import Search from "@/components/ui/Search";
import LeftArrow from "@/components/ui/svgs/left-arrow";
import RightArrow from "@/components/ui/svgs/right-arrow";
import { Task } from "@/types";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import TodoColumn from "@/components/ui/TodoColumn";
import InProgressColumn from "@/components/ui/InProgressColumn";
import CompletedColumn from "@/components/ui/CompletedColumn";

const todoTasksData: Task[] = [
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
];

const inProgressTasksData: Task[] = [
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
];

const completedTasksData: Task[] = [
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

export default function Home() {
  const [completedTasks, setCompletedTasks] =
    useState<Task[]>(completedTasksData);
  const [todoTasks, setTodoTasks] = useState<Task[]>(todoTasksData);
  const [inProgressTasks, setInProgressTasks] =
    useState<Task[]>(inProgressTasksData);

  const columns = [
    { id: "todo", cards: todoTasks.filter(Boolean) },
    { id: "in-progress", cards: inProgressTasks.filter(Boolean) },
    { id: "completed", cards: completedTasks.filter(Boolean) },
  ];

  const findColumn = (
    unique: string | null
  ): {
    id: string;
    cards: Task[];
  } | null => {
    if (!unique) {
      return null;
    }

    if (["todo", "in-progress", "completed"].includes(unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const taskId = Number(unique);
    const columnId = [
      ...todoTasks.filter(Boolean),
      ...inProgressTasks.filter(Boolean),
      ...completedTasks.filter(Boolean),
    ].find((task) => task.id === taskId)?.status;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;
    const activeColumn = findColumn(activeId as string);
    const overColumn = findColumn(overId as string);
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    const activeItems = activeColumn.cards;
    const overItems = overColumn.cards;
    const activeIndex = activeItems.findIndex((i) => i.id === activeId);
    const overIndex = overItems.findIndex((i) => i.id === overId);
    const newIndex = () => {
      const putOnBelowLastItem =
        overIndex === overItems.length - 1 && delta.y > 0;
      const modifier = putOnBelowLastItem ? 1 : 0;
      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    };
    const newColumns = [...columns].map((c) => {
      if (c.id === activeColumn.id) {
        c.cards = activeItems.filter((i) => i.id !== activeId);
        return c;
      } else if (c.id === overColumn.id) {
        c.cards = [
          ...overItems.slice(0, newIndex()),
          activeItems[activeIndex],
          ...overItems.slice(newIndex(), overItems.length),
        ];
        return c;
      } else {
        return c;
      }
    });
    setTodoTasks(newColumns[0].cards.filter(Boolean));
    setInProgressTasks(newColumns[1].cards.filter(Boolean));
    setCompletedTasks(newColumns[2].cards.filter(Boolean));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;
    const activeColumn = findColumn(activeId as string);
    const overColumn = findColumn(overId as string);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    if (activeIndex !== overIndex) {
      const newColumns = [...columns].map((column) => {
        if (column.id === activeColumn.id) {
          column.cards = arrayMove(overColumn.cards, activeIndex, overIndex);
          return column;
        } else {
          return column;
        }
      });
      setTodoTasks(newColumns[0].cards.filter(Boolean));
      setInProgressTasks(newColumns[1].cards.filter(Boolean));
      setCompletedTasks(newColumns[2].cards.filter(Boolean));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;

  return (
    <main className="px-3 py-6 md:py-10 md:px-8">
      <div className="space-y-4 md:space-y-0 md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="font-sfPro font-semibold text-xl md:text-3xl grow md:flex-grow-0">
            {formattedDate}
          </p>
          <div className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100">
            <LeftArrow />
          </div>
          <div className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100">
            <RightArrow />
          </div>
        </div>
        <Search className="md:grow-0 md:min-w-60" />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="mt-8 px-[6px] py-4 grid grid-cols-3 gap-4">
          <TodoColumn todoTasks={todoTasks.filter(Boolean)} />
          <InProgressColumn inProgressTasks={inProgressTasks.filter(Boolean)} />
          <CompletedColumn completedTasks={completedTasks.filter(Boolean)} />
        </div>
      </DndContext>
    </main>
  );
}
