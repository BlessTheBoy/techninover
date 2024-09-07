import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Order, SortedTasks, Task } from "@/types";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  const date = params.date;
  let tasks: Task[] = [];
  let order;
  try {
    tasks = await prisma.task
      .findMany({
        where: {
          date: date,
        },
      })
      .then((tasks) => tasks as Task[]);
    order = await prisma.order.findUnique({
      where: {
        date: date,
      },
    }).then((order) => order as Order);
  } catch (error) {
    return Response.json(`Failed to fetch tasks for ${date}`, { status: 500 });
  }
  const sortedTasks: SortedTasks = {
    todo:
      (order.todo
        ?.split(",")
        .map((id) => tasks.find((task) => task.id == parseInt(id)))
        .filter(Boolean) as Task[]) ?? [],
    "in-progress":
      (order.in_progress
        ?.split(",")
        .map((id) => tasks.find((task) => task.id == parseInt(id)))
        .filter(Boolean) as Task[]) ?? [],
    completed:
      (order.completed
        ?.split(",")
        .map((id) => tasks.find((task) => task.id == parseInt(id)))
        .filter(Boolean) as Task[]) ?? [],
  };

  return Response.json(sortedTasks, { status: 200 });
}
