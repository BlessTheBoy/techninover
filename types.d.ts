export type Task = {
  date: string;
  description: null | string;
  id: number;
  priority: null | "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  title: string;
  tracker: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null | Date;
  // deadline: string;
  // createdAt: string;
  // updatedAt: string;
  // deletedAt: null | string;
  cover: string | null;
};

export type SortedTasks = {
  todo: Task[];
  "in-progress": Task[];
  completed: Task[];
};
