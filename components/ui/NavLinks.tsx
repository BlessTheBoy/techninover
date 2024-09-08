"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import CalendarIcon from "./svgs/calendar-icon";
import InboxIcon from "./svgs/inbox-icon";
import NotesIcon from "./svgs/notes-icon";
import TodoIcon from "./svgs/todo-icon";
import SettingsIcon from "./svgs/settings-icon";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "CALENDAR", href: "/", icon: CalendarIcon },
  {
    name: "INBOX",
    href: "/inbox",
    icon: InboxIcon,
  },
  {
    name: "NOTES",
    href: "/notes",
    icon: NotesIcon,
  },
  {
    name: "TODO LIST",
    href: "/todo",
    icon: TodoIcon,
  },
  {
    name: "SETTINGS",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "group flex h-[48px] md:h-auto grow items-center justify-center gap-5 rounded-md p-3 text-sm font-medium hover:bg-purple/20 dark:text-[#65676D] hover:text-purple md:flex-none md:justify-start md:p-5 md:rounded-none",
              {
                "bg-purple/20 dark:text-purple text-purple md:border-r-[6px] border-purple":
                  pathname === link.href ||
                  (link.href === "/" &&
                    !["/inbox", "/notes", "/todo"].includes(pathname)),
              }
            )}
          >
            <LinkIcon
              className={clsx(
                "w-6 md:w-9 group-hover:fill-purple group-hover:stroke-purple",
                {
                  "fill-purple stroke-purple": pathname === link.href,
                }
              )}
            />
            <p
              className={clsx(
                "hidden lg:block font-sfPro font-semibold text-lg",
                {
                  "text-purple":
                    pathname === link.href ||
                    (link.href === "/" &&
                      !["/inbox", "/notes", "/todo"].includes(pathname)),
                }
              )}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
