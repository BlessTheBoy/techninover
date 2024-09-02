"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskEditForm from "@/components/ui/TaskEditForm";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-sfPro font-semibold text-2xl">
            Edit Task
          </DialogTitle>
        </DialogHeader>
        <Suspense fallback={null}>
          <TaskEditForm id={Number(params.id)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
