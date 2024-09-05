import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SortedTasks, Task } from "@/types";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  const date = params.date;
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
    todo: [],
    "in-progress": [],
    completed: [],
  };

  tasks
    .sort((a, b) => {
      if (a.tracker && b.tracker) {
        return a.tracker > b.tracker ? -1 : 1;
      }
      return 0;
    })
    .forEach((task) => {
      sortedTasks[task.status].push(task);
    });
  
  return Response.json(sortedTasks, { status: 200 });
}
