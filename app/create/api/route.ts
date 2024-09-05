import { NextRequest } from "next/server";
import { z } from "zod";
import { CreateTaskServerSchema } from "../../lib/zod";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { SortedTasks, Task } from "@/types";

const prisma = new PrismaClient();

type CreateTask = z.infer<typeof CreateTaskServerSchema>;

export async function POST(request: NextRequest) {
  const arg: FormData = await request.formData();
  const body = Object.fromEntries(arg.entries()) as CreateTask;

  console.log(body);

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

  try {
    await prisma.task.create({
      data: body,
    });
  } catch (error) {
    return Response.json("Failed to add task to database", { status: 500 });
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
    todo: [],
    "in-progress": [],
    completed: [],
  };

  tasks
    .sort((a, b) => {
      if (a.tracker && b.tracker) {
        return a.tracker == b.tracker
          ? a.updatedAt > b.updatedAt
            ? -1
            : 1
          : a.tracker > b.tracker
          ? -1
          : 1;
      }
      return 0;
    })
    .forEach((task) => {
      sortedTasks[task.status].push(task);
    });

  return Response.json(sortedTasks, { status: 200 });
}
