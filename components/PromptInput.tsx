import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ModeToggle";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { SelectedStyleBadge } from "@/components/SelectedStyleBadge/SelectedStyleBadge";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  selectedStyle?: string | null;
  onClearStyle?: () => void;
  selectedColorId?: string | null;
  onSelectColor?: (id: string | null) => void;
  selectedRatio?: string | null;
  onClearRatio?: () => void;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  selectedStyle,
  onClearStyle,
  selectedColorId,
  onSelectColor,
  selectedRatio,
  onClearRatio,
}: Readonly<PromptInputProps>) {
  const selectedColorLabel =
    selectedColorId === "black-white"
      ? "Black & White"
      : selectedColorId === "colorful"
        ? "Full Color"
        : selectedColorId ?? null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className="w-full bg-zinc-50 rounded-2xl p-4 border border-zinc-700 shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Don't overthink it, just be yourself"
        rows={3}
        className="text-[22px] md:text-[22px] bg-transparent border border-zinc-400 rounded-md p-2 resize-none placeholder:text-zinc-500 text-[#111111] focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-0"
      />
      <div className="flex flex-wrap items-center justify-center gap-8 pt-1 pb-[10px]">
        <ModeToggle />
        {onSelectColor && (
          <>
            <LiquidMetalButton
              label="Black & White"
              onClick={() => onSelectColor("black-white")}
              viewMode="text"
              animate={true}
            />
            <LiquidMetalButton
              label="Full Color"
              onClick={() => onSelectColor("colorful")}
              viewMode="text"
              animate={true}
            />
          </>
        )}
        {selectedStyle && (
          <SelectedStyleBadge
            selectedStyle={selectedStyle}
            onClear={onClearStyle}
          />
        )}
        {selectedColorLabel && (
          <SelectedStyleBadge
            selectedStyle={selectedColorLabel}
            onClear={() => onSelectColor?.(null)}
          />
        )}
        {selectedRatio && (
          <SelectedStyleBadge
            selectedStyle={selectedRatio}
            onClear={onClearRatio}
          />
        )}
      </div>
    </div>
  );
}
