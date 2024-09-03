export type Task = {
  id: number;
  priority?: "low" | "medium" | "high";
  title: string;
  cover?: string;
  description?: string;
  deadline: string;
  status: "todo" | "in-progress" | "completed";
};