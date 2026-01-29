import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStyleLabel } from "@/lib/utils";

interface SelectedStyleBadgeProps {
  selectedStyle: string;
  onClear?: () => void;
}

export function SelectedStyleBadge({
  selectedStyle,
  onClear,
}: Readonly<SelectedStyleBadgeProps>) {
  if (!selectedStyle) return null;

  const label = getStyleLabel(selectedStyle);

  return (
    <Badge
      variant="secondary"
      className="rounded-full px-3 py-1 text-sm font-medium flex items-center cursor-pointer bg-black text-white hover:bg-black/80 transition-colors"
      onClick={onClear}
    >
      {label}
    </Badge>
  );
}
