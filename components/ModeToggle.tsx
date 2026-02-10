"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <LiquidMetalButton
        viewMode="icon"
        icon={<Sun className="h-[1.2rem] w-[1.2rem]" />}
      />
    );
  }

  return (
    <LiquidMetalButton
      viewMode="icon"
      onClick={toggleTheme}
      icon={
        <div className="relative flex items-center justify-center w-5 h-5">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-[var(--foreground)]" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-[var(--foreground)]" />
        </div>
      }
    />
  );
}
