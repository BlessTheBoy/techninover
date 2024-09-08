"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Logo() {
  const [darkMode, setDarkMode] = useState(true);

  // useEffect(() => {
  //   // Check if user has a theme preference in localStorage
  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme) {
  //     setDarkMode(savedTheme === "dark");
  //   } else {
  //     // If no saved preference, check system preference
  //     const prefersDark = window.matchMedia(
  //       "(prefers-color-scheme: dark)"
  //     ).matches;
  //     setDarkMode(prefersDark);
  //   }
  // }, []);

  return (
    <>
      {darkMode ? (
        <Image
          src="/techinnoverDark.png"
          alt="Acme Logo"
          width={180}
          height={44}
        />
      ) : (
        <Image src="/techinnover.png" alt="Acme Logo" width={180} height={44} />
      )}
    </>
  );
}
