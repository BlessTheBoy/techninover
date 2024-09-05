import { CreateTaskServerSchema } from "@/app/lib/zod";
import { SortedTasks, Task } from "@/types";
import { PrismaClient } from "@prisma/client";
import { del, put } from "@vercel/blob";
import { NextRequest } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!task) {
      return Response.json("Task not found", { status: 404 });
    }
    return Response.json(task, { status: 200 });
  } catch (error) {
    return Response.json("Failed to fetch task", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });
    return Response.json("Task deleted", { status: 200 });
  } catch (error) {
    return Response.json("Failed to delete task", { status: 500 });
  }
}

type CreateTask = z.infer<typeof CreateTaskServerSchema>;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const arg: FormData = await request.formData();
  const body = Object.fromEntries(arg.entries()) as CreateTask;

  const coverType = typeof body.cover;

  const activeTask = await prisma.task.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (
    coverType === "string" &&
    body.cover?.includes(
      "https://yoionrmduxakdphi.public.blob.vercel-storage.com"
    )
  ) {
    delete body.cover;
  } else if (coverType === "object") {
    try {
      const imageFile = arg.get("cover") as File;
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      });
      body.cover = blob.url;
    } catch (error) {
      return Response.json("Failed to upload image", { status: 500 });
    }
  } else if (coverType === "undefined" && activeTask?.cover) {
    try {
      await del(activeTask.cover);
      body.cover = undefined;
    } catch (error) {
      // return Response.json("Failed to delete image", { status: 500 });
    }
  }

  try {
    await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: { ...activeTask, ...body },
    });
  } catch (error) {
    return Response.json("Failed to update task", { status: 500 });
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
        return a.tracker > b.tracker ? -1 : 1;
      }
      return 0;
    })
    .forEach((task) => {
      sortedTasks[task.status].push(task);
    });

  return Response.json(sortedTasks, { status: 200 });
}
