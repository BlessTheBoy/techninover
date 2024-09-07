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
import useSWR, { mutate } from "swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useSWRMutation from "swr/mutation";
import TaskListLoader, {
  MobileTaskListLoader,
} from "@/components/ui/TaskListLoader";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
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

  const searchParams = useSearchParams();
  const createPageURL = (date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("date", date);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const taskDate = searchParams.get("date");
  console.log("taskDate", taskDate);
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
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 1);
                createPageURL(newDate.toISOString().split("T")[0]);
                setCurrentDate(newDate);
              }}
            >
              <LeftArrow />
            </div>
            <div
              className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 1);
                createPageURL(newDate.toISOString().split("T")[0]);
                setCurrentDate(newDate);
              }}
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
            <TaskListLoader />
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
          <MobileTaskListLoader />
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
