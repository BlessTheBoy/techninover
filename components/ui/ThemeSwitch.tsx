"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    // Update the class on the html element when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Button onClick={toggleTheme} variant="outline" size="icon">
      {darkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
