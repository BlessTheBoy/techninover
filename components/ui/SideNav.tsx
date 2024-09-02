import Link from "next/link";
import NavLinks from "./NavLinks";
import Image from "next/image";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 pt-10 md:px-0">
      <Link className="mx-auto mb-8 md:mb-[60px] md:hidden lg:block" href="/">
        <Image src="/techinnover.png" alt="Acme Logo" width={180} height={44} />
      </Link>
      <div className="hidden mx-auto mb-8 md:mb-[60px] h-11 md:lg:block lg:hidden" />
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-1 md:justify-center">
        <NavLinks />
      </div>
    </div>
  );
}
