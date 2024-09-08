"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "@/components/ui/TaskForm";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] overflow-auto ">
        <DialogHeader>
          <DialogTitle className="font-sfPro font-semibold text-2xl">
            Add Task
          </DialogTitle>
        </DialogHeader>
        <Suspense fallback={null}>
          <TaskForm />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
