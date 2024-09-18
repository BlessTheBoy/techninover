import { NextRequest } from "next/server";
import { z } from "zod";
import { CreateTaskServerSchema } from "@/lib/zod";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { Order, SortedTasks, Task } from "@/types";

const prisma = new PrismaClient();

type CreateTask = z.infer<typeof CreateTaskServerSchema>;

export async function POST(request: NextRequest) {
  const arg: FormData = await request.formData();
  const body = Object.fromEntries(arg.entries()) as CreateTask;

  if (body.cover) {
    try {
      const imageFile = arg.get("cover") as File;
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      });
      body.cover = blob.url;
    } catch (error) {
      return Response.json("Failed to upload image", { status: 500 });
    }
  }

  let task: Task;

  try {
    const taskBody: any = {...body};
    delete taskBody.status;
    task = await prisma.task
      .create({
        data: taskBody,
      })
      .then((task) => task as Task);
  } catch (error) {
    return Response.json("Failed to add task to database", { status: 500 });
  }

  const orderKey = body.status.replace("-", "_") as keyof Order;

  const order = await prisma.order.findUnique({
    where: {
      date: body.date,
    },
  });

  let updatedOrder: Order;

  if (order) {
    try {
      updatedOrder = await prisma.order.update({
        where: {
          date: body.date,
        },
        data: {
          [orderKey]: order[orderKey]
            ? `${task.id},${order[orderKey]}`
            : `${task.id}`,
        },
      });
    } catch (error) {
      return Response.json("Failed to update order", { status: 500 });
    }
  } else {
    try {
      updatedOrder = await prisma.order.create({
        data: {
          date: body.date,
          todo: orderKey === "todo" ? `${task.id}` : "",
          in_progress: orderKey === "in_progress" ? `${task.id}` : "",
          completed: orderKey === "completed" ? `${task.id}` : "",
        },
      });
    } catch (error) {
      return Response.json("Failed to create order", { status: 500 });
    }
  }

  // conclusion
  const date = body.date;
  let tasks: Task[] = [];
  try {
    tasks = await prisma.task
      .findMany({
        where: {
          date: date,
        },
      })
      .then((tasks) => tasks as Task[]);
  } catch (error) {
    return Response.json(`Failed to fetch tasks for ${date}`, { status: 500 });
  }

  const sortedTasks: SortedTasks = {
    todo:
      (
        updatedOrder?.todo
          ?.split(",")
          .map((id) => tasks.find((task) => task.id == parseInt(id)))
          .filter(Boolean) as Task[]
      ).map((t) => ({ ...t, status: "todo" })) ?? [],
    "in-progress":
      (
        updatedOrder?.in_progress
          ?.split(",")
          .map((id) => tasks.find((task) => task.id == parseInt(id)))
          .filter(Boolean) as Task[]
      ).map((t) => ({ ...t, status: "in-progress" })) ?? [],
    completed:
      (
        updatedOrder?.completed
          ?.split(",")
          .map((id) => tasks.find((task) => task.id == parseInt(id)))
          .filter(Boolean) as Task[]
      ).map((t) => ({ ...t, status: "completed" })) ?? [],
  };

  return Response.json(sortedTasks, { status: 200 });
}
