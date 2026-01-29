"use client";

import { Button } from "@/components/ui/button";

interface VibeCheckProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function VibeCheck({ onClick, isActive }: Readonly<VibeCheckProps>) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="default"
      className="rounded-full"
      onClick={onClick}
    >
      Vibe Check
    </Button>
  );
}


