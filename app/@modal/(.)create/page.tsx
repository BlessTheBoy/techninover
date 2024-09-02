"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "@/components/ui/TaskForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      router.push("/create");
    }
  }, [isMobile, router]);

  if (isMobile) {
    return null; // This will briefly show before redirecting
  }

  return (
    <Dialog
      defaultOpen
      onOpenChange={() => router.back()}
    >
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-sfPro font-semibold text-2xl">
            Add Task
          </DialogTitle>
        </DialogHeader>
        <TaskForm />
      </DialogContent>
    </Dialog>
  );
}
