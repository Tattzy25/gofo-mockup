import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ModeToggle";
import { SelectedStyleBadge } from "@/components/SelectedStyleBadge/SelectedStyleBadge";
import { useToast } from "@/hooks/use-toast";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  selectedStyle?: string | null;
  onClearStyle?: () => void;
  selectedColor?: string | null;
  onClearColor?: () => void;
  selectedRatio?: string | null;
  onClearRatio?: () => void;
}

export function PromptInput({
  value,
  onChange,
  isLoading,
  onSubmit,
  selectedStyle,
  onClearStyle,
  selectedColor,
  onClearColor,
  selectedRatio,
  onClearRatio,
}: Readonly<PromptInputProps>) {
  const { toast } = useToast();

  useEffect(() => {
    // URL injection removed
  }, [selectedStyle]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="bg-zinc-50 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="w-full px-2 mx-auto mb-6 mt-2 text-center">
            <h3 className="text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed tracking-tight font-orbitron italic">
              &quot;If the ink could speak and looked you dead in the eyes — WHO THE FUCK ARE YOU, REALLY? — what would you say?&quot;
            </h3>
          </div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Don't overthink it, just be yourself"
            rows={3}
            className="text-base bg-transparent border border-zinc-300 rounded-md p-2 resize-none placeholder:text-zinc-500 text-[#111111] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center justify-center pt-1 pb-[10px]">
            <div className="flex items-center gap-2">
              <ModeToggle />
              {selectedStyle && (
                <SelectedStyleBadge
                  selectedStyle={selectedStyle}
                  onClear={onClearStyle}
                />
              )}
              {selectedColor && (
                <SelectedStyleBadge
                  selectedStyle={selectedColor}
                  onClear={onClearColor}
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
        </div>
      </div>
    </div>
  );
}
