"use server";

import { z } from "zod";
import { CreateTaskServerSchema } from "./zod";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateTask = z.infer<typeof CreateTaskServerSchema>;

export async function createTask(arg: FormData) {
  "use server";
  const body = Object.fromEntries(arg.entries()) as CreateTask;

  if (body.cover) {
    try {
      const imageFile = arg.get("cover") as File;
      const blob = await put(imageFile.name, imageFile, {
        access: "public",
      });
      body.cover = blob.url;
    } catch (error) {
      return {
        status: 500,
        body: "Failed to upload image",
        success: false,
      };
    }
  }

  // let blob: any | undefined;
  // if (body.cover) {
  //   try {
  //     const filename = body.cover as string;
  //     blob = await put(filename, arg.get("cover") as Blob, {
  //       access: "public",
  //     });
  //   } catch (error) {
  // return {
  //   status: 500,
  //   body: "Failed to upload image",
  //   success: false,
  // };
  //   }
  // }

  // add task to database
  // console.log(body);
  //   {
  //   title: 'Hello',
  //   description: 'World',
  //   status: 'in-progress',
  //   priority: 'high',
  //   date: '2024-09-04',
  //   cover: 'https://yoionrmduxakdphi.public.blob.vercel-storage.com/1494-K5NvWrNgV4NC9EN4qTL1PSLG9x2c0i.png',
  //   deadline: 'Thu Sep 05 2024 17:33:00 GMT+0100 (West Africa Standard Time)'
  //   }
  // const result = await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;

  try {
    const newTask = await prisma.task.create({
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
