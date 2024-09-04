"use server";

import { z } from "zod";
import { CreateTaskServerSchema } from "./zod";
import { put } from "@vercel/blob";

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

  return {
    status: 200,
    body,
    success: true,
  };
}
