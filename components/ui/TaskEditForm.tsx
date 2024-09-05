"use client";

import React, { useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import clsx from "clsx";
import ImageUploader from "./ImageUploader";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { Button } from "./button";
import { notFound, useRouter } from "next/navigation";
import { SortedTasks, Task } from "@/types";
import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import useSWRMutation from "swr/mutation";
import { CreateTaskClientSchema } from "@/app/lib/zod";

export default function TaskEditForm({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();

  const {
    data: task,
    error,
    isLoading,
  } = useSWR(
    `${id}`,
    async () => {
      const res = await fetch(`/task/${id}`, {
        method: "get",
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      return result as Task;
    },
    {
      onError(error) {
        toast({
          variant: "destructive",
          title: "Error fetching task.",
          description: error,
        });
      },
      onSuccess: (data) => {
        setTaskData((t) =>{
          if(t.status) return t;
          return {
            status: data.status,
            priority: data.priority ?? undefined,
            time: new Date(data.deadline),
            date: new Date(data.deadline),
            cover: data.cover ?? undefined,
          };
        });
      },
    }
  );

  console.log("task", task)

  const { trigger, isMutating } = useSWRMutation(
    `${task?.date}`,
    async (_, { arg }: { arg: FormData }) => {
      const res = await fetch(`/task/${task?.id}`, {
        method: "put",
        body: arg,
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      return result as SortedTasks;
    },
    {
      onSuccess: () => {
        router.back();
        // router.push(`/?date=${task?.date}`);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error,
        });
      },
      populateCache: (newSortedTasks) => newSortedTasks,
      revalidate: true,
    }
  );

  const [taskData, setTaskData] = useState<{
    status: "todo" | "in-progress" | "completed" | undefined;
    priority: "low" | "medium" | "high" | undefined;
    time: Date | undefined;
    date: Date | undefined;
    cover: string | undefined;
  }>({
    status: task?.status ?? undefined,
    priority: task?.priority ?? undefined,
    time: task ? new Date(task.deadline) : undefined,
    date: task ? new Date(task.deadline) : undefined,
    cover: task?.cover ?? undefined,
  });

  const [fieldError, setFieldError] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    date: "",
    time: "",
  });

  if (error?.status === 404 || error?.includes("not found")) {
    notFound();
  }

  if (!task) return null;

  return (
    <form className="pb-10" action={handleSubmit}>
      <div className="space-y-5 mb-12">
        <Input
          label="Task Name"
          placeholder="Enter task name"
          defaultValue={task?.title}
          name="title"
          error={fieldError.title}
        />
        <TextArea
          label="Description"
          placeholder="Enter task description"
          name="description"
          optional
          error={fieldError.description}
          defaultValue={task?.description ?? undefined}
        />
        <div className="grid items-center gap-1.5">
          <label className="font-inter font-medium text-sm text-text_header">
            Status
          </label>
          <Select
            onValueChange={(v) =>
              setTaskData({
                ...taskData,
                status: v as "todo" | "in-progress" | "completed",
              })
            }
            defaultValue={taskData.status}
            name="status"
          >
            <SelectTrigger className="h-12 rounded-xl border border-gray_8 placeholder:text-[#848585] w-full px-[14px] outline-purple">
              <SelectValue placeholder="Select task status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="todo"
                  className="text-error hover:bg-error_bg"
                >
                  To do
                </SelectItem>
                <SelectItem
                  value="in-progress"
                  className="text-medium hover:bg-medium_bg"
                >
                  In progress
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="text-success hover:text-success hover:bg-success_bg"
                >
                  Completed
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldError.status ? (
            <p className="text-error text-xs">{fieldError.status}</p>
          ) : null}
        </div>
        <div className="grid items-center gap-1.5">
          <label className="font-inter font-medium text-sm text-text_header">
            Priority
          </label>
          <Select
            onValueChange={(v) =>
              setTaskData({
                ...taskData,
                priority: v as "low" | "medium" | "high",
              })
            }
            defaultValue={taskData.priority}
            name="priority"
          >
            <SelectTrigger className="h-12 rounded-xl border border-gray_8 placeholder:text-[#848585] w-full px-[14px] outline-purple">
              {taskData.priority ? (
                <div
                  className={clsx(
                    "h-6 px-2 rounded-[0.25rem] flex justify-center items-center w-fit text-[#848585]",
                    {
                      "bg-success_bg text-success font-inter font-medium text-xs":
                        taskData.priority == "high",
                    },
                    {
                      "bg-medium_bg text-medium font-inter font-medium text-xs":
                        taskData.priority == "medium",
                    },
                    {
                      "bg-error_bg text-error font-inter font-medium text-xs":
                        taskData.priority == "low",
                    }
                  )}
                >
                  {taskData.priority.toUpperCase()}
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
          {fieldError.priority ? (
            <p className="text-error text-xs">{fieldError.priority}</p>
          ) : null}
        </div>
        <ImageUploader
          image={taskData.cover}
          setImage={(v) => setTaskData({ ...taskData, cover: v })}
          label="Upload cover"
          optional
        />
        <div className="flex gap-4">
          <DatePicker
            label="Deadline"
            date={taskData.date}
            setDate={(v) => setTaskData({ ...taskData, date: v })}
            error={fieldError.date}
          />
          <TimePicker
            label="Time"
            time={taskData.time}
            setTime={(v) => setTaskData({ ...taskData, time: v })}
            error={fieldError.time}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isMutating}>
        {isMutating ? "Saving Task..." : "Save Task"}
      </Button>
    </form>
  );

  function handleSubmit(formData: FormData) {
    const data: any = Object.fromEntries(formData.entries());
    data.time = taskData.time;
    data.date = taskData.date;
    data.priority = taskData.priority;
    data.status = taskData.status;

    const validatedFields =
      CreateTaskClientSchema.passthrough().safeParse(data);

    if (!validatedFields.success) {
      const validationErrors = validatedFields.error.flatten().fieldErrors;
      setFieldError({
        title: validationErrors.title?.[0] ?? "",
        description: validationErrors.description?.[0] ?? "",
        status: validationErrors.status?.[0] ?? "",
        priority: validationErrors.priority?.[0] ?? "",
        date: validationErrors.date?.[0] ?? "",
        time: validationErrors.time?.[0] ?? "",
      });
      return;
    }
    setFieldError({
      title: "",
      description: "",
      status: "",
      priority: "",
      date: "",
      time: "",
    });

    const requestData: any = { ...validatedFields.data };
    const deadline = new Date(validatedFields.data.date);
    deadline.setHours(
      validatedFields.data.time.getHours(),
      validatedFields.data.time.getMinutes()
    );
    requestData.deadline = deadline.toISOString();
    delete requestData.time;
    requestData.date = task!.date;
    if (!taskData.cover && (data.cover as File)?.size === 0)
      delete requestData.cover;
    if (taskData.cover && (data.cover as File)?.size === 0)
      requestData.cover = taskData.cover;

    // console.log("validated", requestData);
    const requestFormData = new FormData();
    for (const key in requestData) {
      if (requestData[key]) requestFormData.append(key, requestData[key]);
    }
    trigger(requestFormData);
  }
}
