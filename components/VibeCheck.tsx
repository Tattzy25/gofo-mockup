"use client";

import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

interface VibeCheckProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function VibeCheck({ onClick, isActive }: Readonly<VibeCheckProps>) {
  return (
    <LiquidMetalButton
      label="Vibe Check"
      onClick={onClick}
      viewMode="text"
      animate={isActive}
    />
  );
}


