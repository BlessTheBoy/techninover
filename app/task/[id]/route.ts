import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

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
