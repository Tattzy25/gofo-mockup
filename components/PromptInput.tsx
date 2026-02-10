import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { cn } from "@/lib/utils";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className="w-full p-4 flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Don't overthink it, just be yourself"
        rows={3}
        className="text-[22px] md:text-[22px] bg-transparent border border-[var(--input)] rounded-md p-2 resize-none placeholder:text-[var(--muted-foreground)] text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
      />
      <div className="flex flex-wrap items-center justify-center gap-8 pt-1 pb-[10px]">
        {onSelectColor && (
          <>
            <button
              type="button"
              onClick={() => onSelectColor("black-white")}
              className={cn(
                "rounded-full transition-all ring-offset-2 ring-offset-[var(--background)]",
                selectedColorId === "black-white"
                  ? "ring-2 ring-black"
                  : "ring-0",
              )}
              aria-pressed={selectedColorId === "black-white"}
              aria-label="Black & White"
            >
              <LiquidMetalButton
                label="Black & White"
                viewMode="text"
                animate={true}
                interactive={false}
              />
            </button>
            <button
              type="button"
              onClick={() => onSelectColor("colorful")}
              className={cn(
                "rounded-full transition-all ring-offset-2 ring-offset-[var(--background)]",
                selectedColorId === "colorful"
                  ? "ring-2 ring-black"
                  : "ring-0",
              )}
              aria-pressed={selectedColorId === "colorful"}
              aria-label="Full Color"
            >
              <LiquidMetalButton
                label="Full Color"
                viewMode="text"
                animate={true}
                interactive={false}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
