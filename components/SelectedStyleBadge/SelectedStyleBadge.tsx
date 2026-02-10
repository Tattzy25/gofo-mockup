import React from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

interface SelectedStyleBadgeProps {
  selectedStyle: string;
  onClear?: () => void;
}

export function SelectedStyleBadge({
  selectedStyle,
  onClear,
}: Readonly<SelectedStyleBadgeProps>) {
  if (!selectedStyle) return null;

  // The label is already formatted by the parent component (ImagePlayground)
  const label = selectedStyle;

  return (
    <LiquidMetalButton
      label={label}
      onClick={onClear}
      viewMode="text"
      animate={true}
    />
  );
}
