import Search from "@/components/ui/Search";
import LeftArrow from "@/components/ui/svgs/left-arrow";
import Plus from "@/components/ui/svgs/plus";
import RightArrow from "@/components/ui/svgs/right-arrow";
import TaskCard from "@/components/ui/TaskCard";
import { Task } from "@/types";

const todoTasks: Task[] = [
  {
    priority: "high",
    id: 1,
    title: "Create a new design",
    status: "todo",
    cover: "/overflowing-bookcases.jpg",
    description:
      "Write a blog post outlining the top 10 productivity tips for busy professionals. The post should be engaging, informative, and include actionable advice. Target word count: 1,200 words.",
    deadline: "2024-08-31T13:34:43.051Z",
  },
  {
    id: 2,
    priority: "medium",
    title: "Create a new design",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 3,
    priority: "low",
    title: "Create a new design",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 4,
    title: "Create a new design",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 5,
    title: "Create a new design",
    status: "todo",
    deadline: "2024-08-31T13:34:43.051Z",
  },
  {
    id: 6,
    title: "Create a new design",
    status: "todo",
    deadline: "2024-08-28T13:34:43.051Z",
  },
];

const inProgressTasks: Task[] = [
  {
    id: 1,
    title: "Create a new design",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 2,
    title: "Create a new design",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 3,
    title: "Create a new design",
    status: "in-progress",
    deadline: "2024-08-28T13:34:43.051Z",
  },
];

const completedTasks: Task[] = [
  {
    id: 1,
    title: "Create a new design",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 2,
    title: "Create a new design",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
  {
    id: 3,
    title: "Create a new design",
    status: "completed",
    deadline: "2024-08-28T13:34:43.051Z",
  },
];

export default function Home() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;

  return (
    <main className="px-3 py-6 md:py-10 md:px-8">
      <div className="space-y-4 md:space-y-0 md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="font-sfPro font-semibold text-xl md:text-3xl grow md:flex-grow-0">
            {formattedDate}
          </p>
          <div className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100">
            <LeftArrow />
          </div>
          <div className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100">
            <RightArrow />
          </div>
        </div>
        <Search className="md:grow-0 md:min-w-60" />
      </div>
      <div className="mt-8 px-[6px] py-4 grid grid-cols-3 gap-4">
        <div className="px-2 py-3 rounded-lg bg-gray_5 space-y-4 h-fit">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="font-inter font-medium text-base">To do</p>
              <div className="px-[6px] h-6 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-sm text-gray_7 flex justify-center items-center">
                {todoTasks.length}
              </div>
            </div>
            <button className="hover:bg-gray-200 rounded-[0.25rem]">
              <Plus />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="px-2 py-3 rounded-lg bg-gray_5 space-y-4 h-fit">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="font-inter font-medium text-base">In progress</p>
              <div className="px-[6px] h-6 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-sm text-gray_7 flex justify-center items-center">
                {inProgressTasks.length}
              </div>
            </div>
            <button className="hover:bg-gray-200 rounded-[0.25rem]">
              <Plus />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="px-2 py-3 rounded-lg bg-gray_5 space-y-4 h-fit">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <p className="font-inter font-medium text-base">Completed</p>
              <div className="px-[6px] h-6 bg-gray_6 rounded-[0.25rem] font-inter font-medium text-sm text-gray_7 flex justify-center items-center">
                {completedTasks.length}
              </div>
            </div>
            <button className="hover:bg-gray-200 rounded-[0.25rem]">
              <Plus />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
