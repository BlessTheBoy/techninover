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
} from "./select";
import clsx from "clsx";
import ImageUploader from "./ImageUploader";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { useToast } from "@/hooks/use-toast";
import { createTaskHelper } from "@/app/lib/helpers";
import { CreateTaskClientSchema } from "@/app/lib/zod";

export default function TaskForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskDate = searchParams.get("date");
  const { toast } = useToast();

  const { trigger, isMutating } = useSWRMutation(
    "create task",
    createTaskHelper,
    {
      onSuccess: (data) => {
        // invalidate the date cache and maybe do optimistic update
        router.back();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      },
    }
  );
  // console.log("requestValues", requestValues);

  const [taskData, setTaskData] = useState<{
    status: "todo" | "in-progress" | "completed" | undefined;
    priority: "low" | "medium" | "high" | undefined;
    time: Date | undefined;
    date: Date | undefined;
    cover: string | undefined;
  }>({
    status:
      (searchParams.get("status")?.toString() as
        | "todo"
        | "in-progress"
        | "completed") ?? undefined,
    priority: undefined,
    time: undefined,
    date: undefined,
    cover: undefined,
  });

  const [fieldError, setFieldError] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    date: "",
    time: "",
  });

  return (
    <form
      className="pb-10"
      // onSubmit={handleSubmit}
      action={handleSubmit}
    >
      <div className="space-y-5 mb-12">
        <Input
          label="Task Name"
          placeholder="Enter task name"
          name="title"
          error={fieldError.title}
        />
        <TextArea
          label="Description"
          placeholder="Enter task description"
          name="description"
          optional
          error={fieldError.description}
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
              <span
                className={clsx({
                  "text-[#848585]": !taskData.status,
                })}
              >
                {taskData.status == "todo"
                  ? "To do"
                  : taskData.status == "in-progress"
                  ? "In progress"
                  : taskData.status == "completed"
                  ? "Completed"
                  : "Select task status"}
              </span>
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
        <div className="space-y-5 md:space-y-0 md:flex md:gap-4">
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
      <Button
        type="submit"
        className={clsx("w-full", {
          "bg-gray_8": isMutating,
        })}
      >
        {isMutating ? "Adding task..." : "Add Task"}
      </Button>
    </form>
  );

  function handleSubmit(formData: FormData) {
    const data: any = Object.fromEntries(formData.entries());
    data.time = taskData.time;
    data.date = taskData.date;
    data.priority = taskData.priority;
    data.status = taskData.status;

    if (!taskData.cover) delete data.cover;

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
    requestData.date = taskDate ?? new Date().toISOString().split("T")[0];

    const requestFormData = new FormData();
    for (const key in requestData) {
      if (requestData[key]) requestFormData.append(key, requestData[key]);
    }
    trigger(requestFormData);
  }
}
