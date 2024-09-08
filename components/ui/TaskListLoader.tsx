import React from "react";
import { Skeleton } from "./Skeleton";

export default function TaskListLoader() {
  return (
    <div className="mt-8 px-[6px] py-4 grid grid-cols-3 gap-4 ">
      {/* column 1 */}
      <div className="px-2 py-3 rounded-lg space-y-4 h-fit bg-gray_5 dark:bg-darkGray_5">
        <div className="flex justify-between items-center">
          <Skeleton className="font-inter font-medium text-base w-20 h-6 bg-gray-200 dark:bg-gray-900" />
          <Skeleton className="w-6 h-6 bg-gray-200 dark:bg-gray-900 rounded-[0.25rem]"></Skeleton>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <CardLoader priority cover description={3} descriptionHalf />
          <CardLoader priority description={1} />
          <CardLoader priority />
        </div>
      </div>

      {/* column 2 */}
      <div className="px-2 py-3 rounded-lg space-y-4 h-fit bg-gray_5 dark:bg-darkGray_5">
        <div className="flex justify-between items-center">
          <Skeleton className="font-inter font-medium text-base w-20 h-6 bg-gray-200 dark:bg-gray-900" />
          <Skeleton className="w-6 h-6 bg-gray-200 dark:bg-gray-900 rounded-[0.25rem]"></Skeleton>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <CardLoader priority />
          <CardLoader priority cover />
        </div>
      </div>

      {/* column 2 */}
      <div className="px-2 py-3 rounded-lg space-y-4 h-fit bg-gray_5 dark:bg-darkGray_5">
        <div className="flex justify-between items-center">
          <Skeleton className="font-inter font-medium text-base w-20 h-6 bg-gray-200 dark:bg-gray-900" />
          <Skeleton className="w-6 h-6 bg-gray-200 dark:bg-gray-900 rounded-[0.25rem]"></Skeleton>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <CardLoader priority cover />
          <CardLoader priority description={1} descriptionHalf />
          <CardLoader priority />
        </div>
      </div>
    </div>
  );
}

export function CardLoader({
  priority,
  cover,
  description,
  descriptionHalf,
}: {
  priority?: boolean;
  cover?: boolean;
  description?: number;
  descriptionHalf?: boolean;
}) {
  return (
    <div className="space-y-4 p-4 rounded-md bg-white dark:bg-darkWhite">
      {priority ? <Skeleton className="h-6 w-16 rounded-[0.25rem]" /> : null}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="flex-1 h-6" />

        <Skeleton className="w-6 h-6 rounded" />
      </div>
      {cover ? <Skeleton className="w-full h-16 rounded" /> : null}
      {description ? (
        <div className="space-y-1">
          {Array(description)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-full h-5" />
            ))}
          {descriptionHalf ? <Skeleton className="w-1/2 h-5" /> : null}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="w-[30%] h-6" />
        <Skeleton className="w-[15%] h-6" />
      </div>
    </div>
  );
}

export function MobileTaskListLoader() {
  return (
    <div className="space-y-4">
      <MobileCardLoader priority cover description={3} descriptionHalf />
      <MobileCardLoader priority />
      <MobileCardLoader priority description={1} descriptionHalf />
    </div>
  );
}

export function MobileCardLoader({
  priority,
  cover,
  description,
  descriptionHalf,
}: {
  priority?: boolean;
  cover?: boolean;
  description?: number;
  descriptionHalf?: boolean;
}) {
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-darkWhite border-b border-gray_8 dark:border-gray-700">
      {priority ? <Skeleton className="h-6 w-16 rounded-[0.25rem]" /> : null}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="flex-1 h-6" />

        <Skeleton className="w-6 h-6 rounded" />
      </div>
      {cover ? <Skeleton className="w-full h-24 rounded" /> : null}
      {description ? (
        <div className="space-y-1">
          {Array(description)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-full h-5" />
            ))}
          {descriptionHalf ? <Skeleton className="w-1/2 h-5" /> : null}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="w-[30%] h-6" />
        <Skeleton className="w-[15%] h-6" />
      </div>
    </div>
  );
}
