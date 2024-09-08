"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";
import Image from "next/image";

export default function SideNav({darkMode}: {darkMode: boolean}) {
  return (
    <>
      <Link className="mx-auto mb-8 md:mb-[60px] md:hidden lg:block" href="/">
        {darkMode ? (
          <Image
            src="/techinnoverDark.png"
            alt="Acme Logo"
            width={180}
            height={44}
          />
        ) : (
          <Image
            src="/techinnover.png"
            alt="Acme Logo"
            width={180}
            height={44}
          />
        )}
      </Link>
      <div className="hidden mx-auto mb-8 md:mb-[60px] h-11 md:lg:block lg:hidden" />
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-1 md:justify-center">
        <NavLinks />
      </div>
    </>
  );
}
