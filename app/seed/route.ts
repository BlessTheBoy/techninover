import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { CreateTaskServerSchema } from "../lib/zod";

const prisma = new PrismaClient();

type CreateTask = z.infer<typeof CreateTaskServerSchema>;

export async function createTask(body: any) {
  try {
    await prisma.task.create({
      data: body,
    });
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: "Failed to add task to database",
      success: false,
    };
  }

  return {
    status: 200,
    body,
    success: true,
  };
}

const todos = [
  {
    priority: "high",
    title: "Create a new design",
    status: "todo",
    cover: "/overflowing-bookcases.jpg",
    description:
      "Write a blog post outlining the top 10 productivity tips for busy professionals. The post should be engaging, informative, and include actionable advice. Target word count: 1,200 words.",
    deadline: "2024-08-31T13:34:43.051Z",
  },
  {
    priority: "medium",
    title: "Home Renovation",
    description:
      "Write a blog post outlining the top 10 productivity tips for busy professionals.",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    priority: "high",
    title: "Organize a charity event",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    priority: "low",
    title: "Watch a Frontend Tutorial",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    priority: "medium",
    title: "Prep my week meal",
    cover: "/meal-prep.avif",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    priority: "medium",
    title: "Read a book",
    cover: "/books.avif",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    priority: "low",
    title: "Improve cards readability",
    description: "As a team license owner, I want to use multiplied limits",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    priority: "high",
    title: "Attend Standup and give updates",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
];

async function seedTodo() {
  const insertedTodos = await Promise.all(
    todos.filter((t) => !t.cover).map(async (todo) => createTask({...todo, date:"2024-09-05"}))
  );
  return insertedTodos;
}

export async function GET() {
  try {
    await prisma.task.deleteMany();
    await seedTodo();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
