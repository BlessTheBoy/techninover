import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTask(body: any) {
  try {
    const id = await prisma.task
      .create({
        data: body,
      })
      .then((task) => task.id);
    return id;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: "Failed to add task to database",
      success: false,
    };
  }
}

const todos: any[] = [
  // {
  //   priority: "high",
  //   title: "Publish my first book",
  //   status: "todo",
  //   // cover: "/overflowing-bookcases.jpg",
  //   description:
  //     "Write a blog post outlining the top 10 productivity tips for busy professionals. The post should be engaging, informative, and include actionable advice. Target word count: 1,200 words.",
  //   deadline: "2024-08-31T13:34:43.051Z",
  // },
  // {
  //   priority: "medium",
  //   title: "Home Renovation",
  //   description:
  //     "Write a blog post outlining the top 10 productivity tips for busy professionals.",
  //   status: "todo",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
  // {
  //   priority: "high",
  //   title: "Organize a charity event",
  //   status: "todo",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
  // {
  //   priority: "low",
  //   title: "Watch a Frontend Tutorial",
  //   status: "in-progress",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
  // {
  //   priority: "medium",
  //   title: "Prep my week meal",
  //   // cover: "/meal-prep.avif",
  //   status: "in-progress",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
  // {
  //   priority: "medium",
  //   title: "Read a book",
  //   // cover: "/books.avif",
  //   status: "completed",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
  // {
  //   priority: "low",
  //   title: "Improve cards readability",
  //   description: "As a team license owner, I want to use multiplied limits",
  //   status: "completed",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
  // {
  //   priority: "high",
  //   title: "Attend Standup and give updates",
  //   status: "completed",
  //   deadline: "2024-08-28T13:34:43.051Z",
  // },
];

async function seedTodo() {
  const todoTasks = todos
    // .filter((t) => !t.cover)
    .filter((t) => t.status == "todo");
  console.log("todoTasks", todoTasks);
  const insertedTodos = await Promise.all(
    todoTasks.map(async (todo) => createTask({ ...todo, date: "2024-09-10" }))
  );
  const in_progressTasks = todos
    // .filter((t) => !t.cover)
    .filter((t) => t.status == "in-progress");
  console.log("in_progressTasks", in_progressTasks);
  const insertedInProgress = await Promise.all(
    in_progressTasks.map(async (todo) =>
      createTask({ ...todo, date: "2024-09-10" })
    )
  );

  const completedTasks = todos
    // .filter((t) => !t.cover)
    .filter((t) => t.status == "completed");
  console.log("completedTasks", completedTasks);
  const insertedCompleted = await Promise.all(
    completedTasks.map(async (todo) =>
      createTask({ ...todo, date: "2024-09-10" })
    )
  );

  const updatedOrder = await prisma.order.create({
    data: {
      date: "2024-09-10",
      todo: insertedTodos.join(","),
      in_progress: insertedInProgress.join(","),
      completed: insertedCompleted.join(","),
    },
  });
  console.log("updatedOrder", updatedOrder);
  // return updatedOrder;
}

export async function GET() {
  console.log("Seeding database");
  try {
    // await prisma.task.deleteMany();
    // await prisma.order.deleteMany();
    await seedTodo();
    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
