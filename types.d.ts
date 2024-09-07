export type Task = {
  date: string;
  description: null | string;
  id: number;
  priority: null | "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  title: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null | Date;
  cover: string | null;
};

export type SortedTasks = {
  todo: Task[];
  "in-progress": Task[];
  completed: Task[];
};

export type ItemData = { containerId: Task["status"]; index: number };

export type Order = {
  todo: string;
  in_progress: string;
  completed: string;
};
