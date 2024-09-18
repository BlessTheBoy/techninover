import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Order, SortedTasks, Task } from "@/types";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const { order, date }: { order: Order; date: string } = await request.json();

  try {
    await prisma.order.update({
      where: {
        date: date,
      },
      data: order,
    });
  } catch (error) {
    return Response.json("Failed to update tasks order", { status: 500 });
  }

  // conclusion
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
    console.error("error", error);
    return Response.json(`Failed to fetch tasks for ${date}`, { status: 500 });
  }
  const sortedTasks: SortedTasks = {
    todo:
      (
        order.todo
          ?.split(",")
          .map((id) => tasks.find((task) => task.id == parseInt(id)))
          .filter(Boolean) as Task[]
      ).map((t) => ({ ...t, status: "todo" })) ?? [],
    "in-progress":
      (
        order.in_progress
          ?.split(",")
          .map((id) => tasks.find((task) => task.id == parseInt(id)))
          .filter(Boolean) as Task[]
      ).map((t) => ({ ...t, status: "in-progress" })) ?? [],
    completed:
      (
        order.completed
          ?.split(",")
          .map((id) => tasks.find((task) => task.id == parseInt(id)))
          .filter(Boolean) as Task[]
      ).map((t) => ({ ...t, status: "completed" })) ?? [],
  };

  return Response.json(sortedTasks, { status: 200 });
}
