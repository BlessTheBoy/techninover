import { createTask } from "./actions";

export async function createTaskHelper(url: string, { arg }: { arg: FormData }) {
  const response = await createTask(arg);
  if (response.success) {
    return response.body;
  } else {
    throw new Error(response.body as string);
  }
}
