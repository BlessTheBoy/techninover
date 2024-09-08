"use client";

import React, { useLayoutEffect } from "react";
import FAB from "@/components/ui/FAB";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import SideNav from "@/components/ui/SideNav";

export default function Themewrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState<undefined | boolean>();

  useLayoutEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme == "dark");
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Update the class on the html element when darkMode changes
    if (darkMode === undefined) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  if (darkMode === undefined) return null;

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row overflow-auto md:overflow-hidden bg-white dark:bg-darkWhite dark:text-white">
        <div className="w-full flex-none md:w-fit lg:w-[17.25rem]">
          <div className="flex h-full flex-col px-3 pt-10 md:px-0">
            <SideNav darkMode={darkMode} />
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 md:mb-4 md:ml-4 md:static dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50"
            >
              {darkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
        <div className="flex-grow md:overflow-y-auto">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>
      </div>
      <FAB />
      <Toaster />
    </>
  );
}
