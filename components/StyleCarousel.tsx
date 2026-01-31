"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LiquidMetalCard } from "@/components/ui/liquid-metal-card";
import { TattooOption } from "@/lib/api-types";

interface CarouselItemProps {
  option: TattooOption;
  isSelected: boolean;
  onClick: () => void;
  selectedClassName?: string;
}

function CarouselItem({ option, isSelected, onClick, selectedClassName }: CarouselItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isPressed = false; // We can add press state if needed, but hover/select is main focus

  // Shadow logic copied from LiquidMetalButton to match the effect
  const boxShadow = isSelected
    ? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
    : isHovered
      ? "0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)"
      : "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Select ${option.label}`}
      data-selected={isSelected ? "true" : undefined}
      className={`
        group relative flex-shrink-0 w-32 flex flex-col items-center gap-3 transition-all duration-200
        ${isSelected ? "scale-[1.05]" : "hover:scale-[1.02]"}
        ${selectedClassName ?? ""}
      `}
    >
      <div 
        className={`
          relative w-32 aspect-[4/5] rounded-lg overflow-hidden transition-all duration-200
        `}
        style={{
          boxShadow: boxShadow,
          transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <LiquidMetalCard
          speed={isSelected || isHovered ? 0.6 : 0}
          className="w-full h-full p-[3px] rounded-xl"
        >
          <div className="relative w-full h-full rounded-[calc(1rem-1px)] overflow-hidden">
            <Image
              src={option.imageUrl}
              alt={option.label}
              fill
              sizes="(min-width: 1024px) 160px, 128px"
              className="object-cover"
            />
          </div>
        </LiquidMetalCard>
      </div>
      <span className={`
        text-sm font-medium tracking-wide transition-colors duration-200
        ${isSelected ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"}
      `}>
        {option.label}
      </span>
    </button>
  );
}

interface StyleCarouselProps {
  visible?: boolean;
  options?: TattooOption[]; // Changed from images: string[]
  onSelect?: (option: TattooOption) => void;
  /** Optional externally-controlled selected option ID(s) */
  selected?: string | string[] | null;
  /** Optional class applied to a selected item */
  selectedClassName?: string;
  emptyMessage?: string;
}

export function StyleCarousel({
  visible = false,
  options,
  onSelect,
  selected,
  selectedClassName,
  emptyMessage,
}: Readonly<StyleCarouselProps>) {
  const [internalSelected, setInternalSelected] = React.useState<string | null>(null);

  if (!visible) return null;

  if (!options || options.length === 0) {
    return (
      <div className="mt-4">
        <div className="text-sm text-muted-foreground px-2">
          {emptyMessage ?? "No options available."}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 px-4 py-[10px]">
          {options.map((option, idx) => {
            // Special sentinel for divider - currently we don't have this in the config, 
            // but if we did, we'd handle it. 
            // For now, let's assume all options are valid cards.

            const selectedIds = selected ?? internalSelected;

            const handleClick = () => {
              setInternalSelected(option.id);
              onSelect?.(option);
            };

            const isSelected = Array.isArray(selectedIds)
              ? selectedIds.includes(option.id)
              : selectedIds === option.id;

            return (
              <CarouselItem
                key={option.id}
                option={option}
                isSelected={isSelected}
                onClick={handleClick}
                selectedClassName={selectedClassName}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
