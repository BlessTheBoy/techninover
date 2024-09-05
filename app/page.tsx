"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverEvent,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskCard from "@/components/ui/TaskCard";
import LeftArrow from "@/components/ui/svgs/left-arrow";
import RightArrow from "@/components/ui/svgs/right-arrow";
import Search from "@/components/ui/Search";
import { SortedTasks, Task } from "@/types";
import TodoColumn from "@/components/ui/TodoColumn";
import InProgressColumn from "@/components/ui/InProgressColumn";
import CompletedColumn from "@/components/ui/CompletedColumn";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import MobileTaskCard from "@/components/ui/MobileTaskCard";
import useSWR, { Arguments, mutate } from "swr";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useSWRMutation from "swr/mutation";

const todoTasksData: any[] = [
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

const inProgressTasksData: any[] = [
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

const completedTasksData: any[] = [
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
  const [activeTask, setActiveTask] = useState<Task | undefined>();
  const [activeColumn, setActiveColumn] = useState<
    "todo" | "in-progress" | "completed"
  >("todo");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // const [tasks, setTasks] = useState({
  //   todo: todoTasksData,
  //   "in-progress": inProgressTasksData,
  //   completed: completedTasksData,
  // });

  //  update (id, index, status)
  // updatable auto index possible?

  const searchParams = useSearchParams();
  const taskDate = searchParams.get("date");
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date>(
    taskDate ? new Date(taskDate) : new Date()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.getDate();
  const formattedDate = `${day} ${month} ${year}`;

  const currentDateString = currentDate.toISOString().split("T")[0];

  const { data: tasks, isLoading } = useSWR(
    currentDateString,
    async (date) => {
      const res = await fetch(`/api/${date}`, {
        method: "get",
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      return result as SortedTasks;
    },
    {
      onError(error) {
        toast({
          variant: "destructive",
          title: "Error fetching tasks.",
          description: error,
        });
      },
      onSuccess(data) {
        const allTasks = [
          ...data.todo,
          ...data["in-progress"],
          ...data.completed,
        ];
        allTasks.forEach((task) => {
          mutate(`${task.id}`, task, false);
        });
      },
    }
  );

  const { trigger: onDragEnd } = useSWRMutation(
    currentDateString,
    async (_, { arg }: { arg: DragEndEvent }) => {
      const { active, over } = arg;
      const res = await fetch(`/api`, {
        method: "put",
        body: JSON.stringify({
          activeId: active.id,
          overId: over?.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      return result as SortedTasks;
    },
    {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error updating task.",
          description: error,
        });
      },
      populateCache: (newSortedTasks) => newSortedTasks,
      revalidate: false,
      rollbackOnError: true,
    }
  );

  const { trigger: onDragOver } = useSWRMutation(
    currentDateString,
    async (_, { arg }: { arg: DragOverEvent }) => {
      const { active, over, delta } = arg;

      const res = await fetch(`/api`, {
        method: "put",
        body: JSON.stringify({
          activeId: active.id,
          overId: over ? over.id : null,
          newColumn: over?.data.current?.sortable.containerId as Task["status"],
          delta: delta.y,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      return result as SortedTasks;
    },
    {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error updating task.",
          description: error,
        });
      },
      populateCache: (newSortedTasks) => newSortedTasks,
      revalidate: false,
      rollbackOnError: true,
    }
  );

  // console.log("data", tasks);
  // console.log("isLoading", isLoading);
  // console.log("error", error);

  return (
    <>
      <main className="px-3 py-6 md:py-10 md:px-8">
        <Link className="hidden md:block lg:hidden w-fit mb-6" href="/">
          <Image
            src="/techinnover.png"
            alt="Acme Logo"
            width={180}
            height={44}
          />
        </Link>
        <div className="space-y-4 md:space-y-0 md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="font-sfPro font-semibold text-xl md:text-3xl grow md:flex-grow-0">
              {formattedDate}
            </p>
            <div
              className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100"
              onClick={() =>
                setCurrentDate((d) => {
                  const newDate = new Date(d);
                  newDate.setDate(d.getDate() - 1);
                  return newDate;
                })
              }
            >
              <LeftArrow />
            </div>
            <div
              className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100"
              onClick={() =>
                setCurrentDate((d) => {
                  const newDate = new Date(d);
                  newDate.setDate(d.getDate() + 1);
                  return newDate;
                })
              }
            >
              <RightArrow />
            </div>
          </div>
          <Search className="md:grow-0 md:min-w-60" />
        </div>

        <div className="hidden md:block">
          {tasks ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            >
              <div className="mt-8 px-[6px] py-4 grid grid-cols-3 gap-4">
                <TodoColumn
                  todoTasks={tasks.todo.filter(Boolean)}
                  activeId={activeTask?.id}
                />
                <InProgressColumn
                  inProgressTasks={tasks["in-progress"].filter(Boolean)}
                  activeId={activeTask?.id}
                />
                <CompletedColumn
                  completedTasks={tasks.completed.filter(Boolean)}
                  activeId={activeTask?.id}
                />
              </div>
              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div>loading...</div>
          )}
        </div>
      </main>
      {/* <main className="block md:hidden">
        <div className="flex border-b border-gray-400 px-2 sticky top-0 bg-white">
          <div
            className={clsx(
              "flex-1 flex gap-2 items-center justify-center py-2 rounded-t mb-[-2px] cursor-pointer",
              {
                "bg-purple_bg text-purple border-b-[3px] border-purple":
                  activeColumn === "todo",
              }
            )}
            onClick={() => setActiveColumn("todo")}
          >
            <p className="font-inter font-medium text-sm">To do</p>
            <div
              className={clsx(
                "px-[4px] h-5 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-xs text-gray_7 flex justify-center items-center",
                { "text-white bg-purple": activeColumn === "todo" }
              )}
            >
              {tasks.todo.length}
            </div>
          </div>
          <div
            className={clsx(
              "flex-1 flex gap-2 items-center justify-center py-2 rounded-t mb-[-2px] cursor-pointer",
              {
                "bg-purple_bg text-purple border-b-[3px] border-purple":
                  activeColumn === "in-progress",
              }
            )}
            onClick={() => setActiveColumn("in-progress")}
          >
            <p className="font-inter font-medium text-sm">In progress</p>
            <div
              className={clsx(
                "px-[4px] h-5 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-xs text-gray_7 flex justify-center items-center",
                { "text-white bg-purple": activeColumn === "in-progress" }
              )}
            >
              {tasks["in-progress"].length}
            </div>
          </div>
          <div
            className={clsx(
              "flex-1 flex gap-2 items-center justify-center py-2 rounded-t mb-[-2px] cursor-pointer",
              {
                "bg-purple_bg text-purple border-b-[3px] border-purple":
                  activeColumn === "completed",
              }
            )}
            onClick={() => setActiveColumn("completed")}
          >
            <p className="font-inter font-medium text-sm">Completed</p>
          </div>
        </div>
        <div className="space-y-4 pb-6">
          {tasks[activeColumn].map((task) => (
            <MobileTaskCard key={task.id} task={task} />
          ))}
        </div>
      </main> */}
    </>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    // console.log("active", active);
    const status: Task["status"] = active.data.current?.sortable.containerId;

    setActiveTask(tasks?.[status].find((i) => i.id === active.id));
  }

  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;
  //   // console.log("active.id, over.id", active, over);

  //   if (over && active.id !== over?.id) {
  //     setTasks((items) => {
  //       const oldStatus = active.data.current?.sortable
  //         .containerId as keyof typeof items;
  //       const newStatus = over?.data.current?.sortable
  //         .containerId as keyof typeof items;
  //       const oldIndex = items[oldStatus].findIndex((i) => i.id === active.id);
  //       const newIndex = items[newStatus].findIndex((i) => i.id === over?.id);

  //       if (oldStatus === newStatus) {
  //         return {
  //           ...items,
  //           [oldStatus]: arrayMove(items[oldStatus], oldIndex, newIndex),
  //         };
  //       } else {
  //         return {
  //           ...items,
  //           [oldStatus]: items[oldStatus].filter((i) => i.id !== active.id),
  //           [newStatus]: [
  //             ...items[newStatus].slice(0, newIndex),
  //             { ...items[oldStatus][oldIndex], status: newStatus },
  //             ...items[newStatus].slice(newIndex),
  //           ],
  //         };
  //       }
  //     });
  //   }

  //   setActiveTask(undefined);
  // }

  async function handleDragEnd(event: DragEndEvent) {
    console.log("handle drag end");
    const { active, over } = event;
    let newData: SortedTasks = {
      todo: [],
      "in-progress": [],
      completed: [],
    };
    console.log("active.id, over.id", active, over);

    if (tasks && over && active.id !== over?.id) {
      const oldStatus = active.data.current?.sortable
        .containerId as Task["status"];
      const newStatus = over?.data.current?.sortable
        .containerId as Task["status"];
      const oldIndex = tasks[oldStatus].findIndex((i) => i.id === active.id);
      const newIndex = tasks[newStatus].findIndex((i) => i.id === over?.id);

      if (oldStatus === newStatus) {
        newData = {
          ...tasks,
          [oldStatus]: arrayMove(tasks[oldStatus], oldIndex, newIndex),
        };
      } else {
        newData = {
          ...tasks,
          [oldStatus]: tasks[oldStatus].filter((i) => i.id !== active.id),
          [newStatus]: [
            ...tasks[newStatus].slice(0, newIndex),
            { ...tasks[oldStatus][oldIndex], status: newStatus },
            ...tasks[newStatus].slice(newIndex),
          ],
        };
      }
      // onDragEnd(event, {
      //   optimisticData: newData,
      // });
      setActiveTask(undefined);
    }
  }

  async function handleDragOver(event: DragOverEvent) {
    const { active, over, delta } = event;
    const activeId = active.id;
    const overId = over ? over.id : null;
    const activeColumn = active.data.current?.sortable
      .containerId as Task["status"];
    const overColumn = over?.data.current?.sortable
      .containerId as Task["status"];

    if (!activeColumn || !overColumn || activeColumn === overColumn || !tasks) {
      return null;
    }
    console.log("handle drag over");
    let newData: SortedTasks = {
      todo: [],
      "in-progress": [],
      completed: [],
    };
    const activeItems = tasks[activeColumn];
    const overItems = tasks[overColumn];
    const activeIndex = activeItems.findIndex((i) => i.id === activeId);
    const overIndex = overItems.findIndex((i) => i.id === overId);
    const newIndex = () => {
      const putOnBelowLastItem =
        overIndex === overItems.length - 1 && delta.y > 0;
      const modifier = putOnBelowLastItem ? 1 : 0;
      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    };

    newData = {
      ...tasks,
      [activeColumn]: activeItems.filter((i) => i.id !== activeId),
      [overColumn]: [
        ...overItems.slice(0, newIndex()),
        { ...activeItems[activeIndex], status: overColumn },
        ...overItems.slice(newIndex(), overItems.length),
      ],
    };

    // onDragOver(event, {
    //   optimisticData: newData,
    // });
    setActiveTask(undefined);
  }
}
