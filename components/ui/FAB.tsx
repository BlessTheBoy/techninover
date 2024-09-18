"use client";

import React from "react";
import Plus from "./svgs/plus";
import { usePathname, useSearchParams } from "next/navigation";

export default function FAB() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const taskDate = searchParams.get("date");

  if (pathname === "/") {
    return (
      // I used an achor tag here to overide the route intercepting modal
      <a
        href={
          taskDate
            ? `/create?date=${taskDate}`
            : "/create"
        }
        className="absolute right-6 bottom-6 bg-purple hover:bg-purple/90 flex items-center justify-center h-12 w-12 rounded-full md:hidden z-10 cursor-pointer"
      >
        <Plus color="white" />
      </a>
    );
  } else {
    return null;
  }
}
