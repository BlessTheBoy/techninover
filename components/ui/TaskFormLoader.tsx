import React from "react";
import { Skeleton } from "./Skeleton";

export default function TaskFormLoader() {
  return (
    <div className="pb-10 pt-10">
      <div className="space-y-5 mb-12">
        <InputLoader />
        <TextAreaLoader />
        <InputLoader />
        <InputLoader />
        <TextAreaLoader />
        <div className="space-y-5 md:space-y-0 md:flex md:gap-4">
          <InputLoader />
          <InputLoader />
        </div>
      </div>
      <ButtonLoader />
    </div>
  );
}

const InputLoader = () => (
  <div className="grid items-center gap-1.5 flex-1">
    <Skeleton className="h-5 w-24" />
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
);

const TextAreaLoader = () => (
  <div className="grid items-center gap-1.5">
    <Skeleton className="h-5 w-24" />
    <Skeleton className="h-36 w-full rounded-xl" />
  </div>
);

const ButtonLoader = () => <Skeleton className="h-10 w-full rounded-md" />;
