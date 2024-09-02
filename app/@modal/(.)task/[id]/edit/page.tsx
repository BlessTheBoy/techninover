"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskEditForm from "@/components/ui/TaskEditForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
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
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-sfPro font-semibold text-2xl">
            Edit Task
          </DialogTitle>
        </DialogHeader>
        <TaskEditForm id={Number(params.id)} />
      </DialogContent>
    </Dialog>
  );
}
