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
import { ItemData, Order, SortedTasks, Task } from "@/types";
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
    async (_, { arg }: { arg: Order }) => {
      const res = await fetch(`/api`, {
        method: "put",
        body: JSON.stringify({ order: arg, date: currentDateString }),
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
                {activeTask ? <TaskCard task={activeTask} overlay /> : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div>loading...</div>
          )}
        </div>
      </main>
      <main className="block md:hidden">
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
              {tasks?.todo.length ?? 0}
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
              {tasks?.["in-progress"].length ?? 0}
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
        {tasks ? (
          <div className="space-y-4 pb-6">
            {tasks[activeColumn].map((task) => (
              <MobileTaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div>loading...</div>
        )}
      </main>
    </>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    // console.log("active", active);
    const status: Task["status"] = active.data.current?.sortable.containerId;

    setActiveTask(tasks?.[status].find((i) => i.id === active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(undefined);
    // console.log("handle drag end");
    const { active, over } = event;
    let newData: SortedTasks = {
      todo: [],
      "in-progress": [],
      completed: [],
    };
    const activeData: { containerId: Task["status"]; index: number } =
      active.data.current?.sortable;
    const overData: { containerId: Task["status"]; index: number } | undefined =
      over?.data.current?.sortable;

    if (!overData || !(tasks && over && active.id !== over?.id)) return;

    // console.log("active.id, over.id", activeData, overData);

    if (activeData.containerId === overData.containerId) {
      newData = {
        ...tasks,
        [activeData.containerId]: arrayMove(
          tasks[activeData.containerId],
          activeData.index,
          overData.index
        ),
      };
    } else {
      newData = {
        ...tasks,
        [activeData.containerId]: tasks[activeData.containerId].filter(
          (i) => i.id !== active.id
        ),
        [overData.containerId]: [
          ...tasks[overData.containerId].slice(0, overData.index),
          {
            ...tasks[activeData.containerId][activeData.index],
            status: overData.containerId,
          },
          ...tasks[overData.containerId].slice(overData.index),
        ],
      };
    }
    const order: Order = {
      todo: newData.todo.map((i) => i.id).join(","),
      in_progress: newData["in-progress"].map((i) => i.id).join(","),
      completed: newData.completed.map((i) => i.id).join(","),
    };
    onDragEnd(order, {
      optimisticData: newData,
      revalidate: false,
    });

    // mutate(`${currentDateString}`, newData, {
    // });
  }

  async function handleDragOver(event: DragOverEvent) {
    const { active, over, delta } = event;
    const overId = over?.id as Task["status"] | undefined;
    const activeData: ItemData = active.data.current?.sortable;
    const overData: ItemData | undefined = over?.data.current?.sortable;

    // console.log("over id data: ", typeof overId, overId, overData);

    if (
      !tasks ||
      !(
        (typeof overId == "number" &&
          overData &&
          overData.containerId !== activeData.containerId) ||
        (typeof overId == "string" &&
          overId !== activeData.containerId &&
          overData == undefined)
      )
    )
      return;

    // console.log("handle drag over");

    let newData: SortedTasks = {
      todo: [],
      "in-progress": [],
      completed: [],
    };

    if (typeof overId == "number" && overData) {
      const overItemsLength = tasks[overData.containerId].length;
      const putBelowLastItem =
        delta.y > 0 && overItemsLength - 1 == overData.index;

      if (putBelowLastItem) {
        newData = {
          ...tasks,
          [activeData.containerId]: tasks[activeData.containerId].filter(
            (i) => i.id !== active.id
          ),
          [overData.containerId]: [
            ...tasks[overData.containerId],
            {
              ...tasks[activeData.containerId][activeData.index],
              status: overData.containerId,
            },
          ],
        };
      } else {
        newData = {
          ...tasks,
          [activeData.containerId]: tasks[activeData.containerId].filter(
            (i) => i.id !== active.id
          ),
          [overData.containerId]: [
            ...tasks[overData.containerId].slice(0, overData.index),
            {
              ...tasks[activeData.containerId][activeData.index],
              status: overData.containerId,
            },
            ...tasks[overData.containerId].slice(overData.index),
          ],
        };
      }
    } else if (typeof overId == "string") {
      newData = {
        ...tasks,
        [activeData.containerId]: tasks[activeData.containerId].filter(
          (i) => i.id !== active.id
        ),
        [overId]: [
          ...tasks[overId],
          {
            ...tasks[activeData.containerId][activeData.index],
            status: overId,
          },
        ],
      };
    }
    mutate(`${currentDateString}`, newData, {
      revalidate: false,
    });
  }
}
