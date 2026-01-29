import React from "react";
import { TattooStyles } from "@/components/Tattoo-Styles/styles";
import { VibeCheck } from "@/components/VibeCheck";
import { ModelMode } from "@/lib/provider-config";

interface PlaygroundControlsProps {
  mode: ModelMode;
  onModeChange: (mode: ModelMode) => void;
  activeCarousel: "style" | "vibe";
  onCarouselChange: (mode: "style" | "vibe") => void;
}

export function PlaygroundControls({
  mode,
  onModeChange,
  activeCarousel,
  onCarouselChange,
}: Readonly<PlaygroundControlsProps>) {
  return (
    <div className="flex items-center space-x-2 py-2">
      <TattooStyles
        isActive={activeCarousel === "style"}
        onClick={() => onCarouselChange("style")}
      />
      <VibeCheck
        isActive={activeCarousel === "vibe"}
        onClick={() => onCarouselChange("vibe")}
      />
    </div>
  );
}
