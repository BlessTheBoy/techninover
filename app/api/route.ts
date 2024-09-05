import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SortedTasks, Task } from "@/types";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const {
    activeId,
    overId,
    newColumn,
    delta,
  }: {
    activeId: number;
    overId: number | undefined;
    newColumn: Task["status"] | undefined;
    delta: number | undefined;
  } = await request.json();

  const activeTask = await prisma.task.findUnique({
    where: {
      id: activeId,
    },
  });
  const overTask = await prisma.task.findUnique({
    where: {
      id: overId,
    },
  });

  if (newColumn) {
    // cross column
    console.log("active task initial tracker", activeTask?.tracker);
    console.log("over task initial tracker", overTask?.tracker);
    // console.log("overId", overId)
    const overItems = await prisma.task.findMany({
      where: {
        status: newColumn,
      },
      orderBy: {
        tracker: "asc",
      },
    });

    let newTracker = activeTask?.tracker;

    const overIndex = overItems.findIndex((item) => item.id === overId);

    if (overItems.length == 0) newTracker = activeTask!.tracker;
    else if (overIndex === -1) {
      const lowestTracker = overItems[0].tracker;
      newTracker = lowestTracker - 1;
    } else {
      const overTracker = overItems[overIndex].tracker;

      newTracker = (() => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta! > 0;
        const modifier = putOnBelowLastItem ? 1 : -1;
        return overTracker + modifier;
      })();
    }

    try {
      await prisma.task.update({
        where: {
          id: activeId,
        },
        data: {
          status: newColumn,
          tracker: newTracker,
        },
      });
    } catch (error) {
      return Response.json("Failed to update tasks", { status: 500 });
    }
  } else {
    // Within same column
    if (!activeTask || !overTask) {
      return Response.json("Tasks not found", { status: 404 });
    }

    if (activeTask.status == overTask.status) {
      // Swap trackers
      let temp = activeTask.tracker;
      if (activeTask.tracker == overTask.tracker) {
        temp = activeTask.tracker - 1;
      }

      try {
        await prisma.task.update({
          where: {
            id: activeId,
          },
          data: {
            tracker: overTask.tracker,
          },
        });
        await prisma.task.update({
          where: {
            id: overId,
          },
          data: {
            tracker: temp,
          },
        });
      } catch (error) {
        return Response.json("Failed to update tasks", { status: 500 });
      }
    } else {
      try {
        await prisma.task.update({
          where: {
            id: activeId,
          },
          data: {
            status: overTask.status,
            tracker: overTask.tracker + 1,
          },
        });
      } catch (error) {
        return Response.json("Failed to update tasks", { status: 500 });
      }
    }
  }

  // conclusion
  const date = activeTask!.date;
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
