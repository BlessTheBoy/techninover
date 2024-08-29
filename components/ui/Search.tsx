"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { useSearchParams, usePathname, useRouter } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";

export default function Search({ className }: { className?: string }) {
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  // const handleSearch = useDebouncedCallback((term: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", "1");
  //   if (term) {
  //     params.set("query", term);
  //   } else {
  //     params.delete("query");
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }, 300);
  return (
    <div className={`relative flex flex-1 flex-shrink-0 ${className}`}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray_4 py-[10px] pl-10 text-sm outline-purple placeholder:gray_2 font-inter shadow-sm shadow-shadow"
        placeholder="Search"
        // onChange={(e) => handleSearch(e.target.value)}
        // defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray_3 peer-focus:text-gray-900" />
    </div>
  );
}
