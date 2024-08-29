import Link from "next/link";
// import { PowerIcon } from "@heroicons/react/24/outline";
import NavLinks from "./nav-links";
import Image from "next/image";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 pt-10 md:px-0">
      <Link className="mx-auto mb-8 md:mb-[60px]" href="/">
        <Image src="/techinnover.png" alt="Acme Logo" width={180} height={44} />
      </Link>
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-1">
        <NavLinks />
        {/* <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form> */}
      </div>
    </div>
  );
}
