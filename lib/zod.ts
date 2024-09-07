import { z } from "zod";

const TaskSchema = z.object({
  title: z.string({
    message: "Title is required",
  }),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed"], {
    message: "Status is required",
    invalid_type_error: 'must be "todo", "in-progress" or "completed"',
  }),
  priority: z
    .enum(["high", "medium", "low"], {
      invalid_type_error: 'must be "high", "medium" or "low"',
    })
    .optional(),
  cover: z.string().optional(),
  deadline: z.string(),
  date: z.string(),
});

export const CreateTaskClientSchema = TaskSchema.omit({
  deadline: true,
  cover: true,
}).extend({
  date: z.date({
    message: "Deadline date is required",
  }),
  time: z.date({
    message: "Deadline time is required",
  }),
});

export const CreateTaskServerSchema = TaskSchema
