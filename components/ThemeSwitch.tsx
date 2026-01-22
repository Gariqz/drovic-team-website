// components/ThemeSwitch.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@heroui/react";

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      isIconOnly
      variant="light"
      radius="full"
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-default-500 hover:text-primary transition-transform"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? (
        <Moon size={22} className="animate-in spin-in-180 fade-in duration-300" />
      ) : (
        <Sun size={22} className="animate-in spin-in-180 fade-in duration-300" />
      )}
    </Button>
  );
};