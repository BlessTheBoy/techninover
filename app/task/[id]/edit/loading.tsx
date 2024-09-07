import LeftArrow from "@/components/ui/svgs/left-arrow";
import TaskFormLoader from "@/components/ui/TaskFormLoader";
import Link from "next/link";
import React from "react";

export default function loading() {
  return (
    <div className="px-3 py-6 md:py-10 md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="w-10 h-10 rounded-full border border-gray_1 flex justify-center items-center hover:bg-gray-100"
        >
          <LeftArrow />
        </Link>
        <p className="font-sfPro font-semibold text-xl md:text-3xl grow md:flex-grow-0">
          Edit Task
        </p>
      </div>
      <TaskFormLoader />
    </div>
  );
}
