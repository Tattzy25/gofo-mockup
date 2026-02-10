"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LiquidMetalCard } from "@/components/ui/liquid-metal-card";
import { TattooOption } from "@/lib/api-types";

const SUBSCRIBE_URL = "/subscribe";

/** Premium card: same liquid metal wrapper as style/color cards, art background + Subscribe Now CTA */
function PremiumCard() {
  return (
    <div
      className="flex flex-shrink-0 w-48 flex flex-col items-center gap-3"
      aria-hidden
    >
      <div
        className="relative w-48 aspect-[4/5] rounded-lg overflow-hidden"
        style={{
          boxShadow:
            "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)",
          transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <LiquidMetalCard speed={0.25} className="w-full h-full !p-0 rounded-xl">
          <div className="relative w-full h-full rounded-[calc(1rem-1px)] overflow-hidden">
            <Image
              src="/PremiumCard.png"
              alt="Premium"
              fill
              sizes="192px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-2">
              <a
                href={SUBSCRIBE_URL}
                className="font-orbitron w-full py-2.5 rounded-full bg-white text-black font-bold text-sm text-center tracking-wide hover:bg-neutral-100 transition-colors shadow-lg"
              >
                Subscribe Now
              </a>
            </div>
          </div>
        </LiquidMetalCard>
      </div>
    </div>
  );
}

interface CarouselItemProps {
  option: TattooOption;
  isSelected: boolean;
  onClick: () => void;
  selectedClassName?: string;
}

function CarouselItem({ option, isSelected, onClick, selectedClassName }: CarouselItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      aria-label={`Select ${option.label}`}
      aria-pressed={isSelected}
      data-selected={isSelected ? "true" : undefined}
      className={`
        group relative flex-shrink-0 w-48 flex flex-col items-center gap-3 transition-all duration-150
        ${isPressed ? "scale-[0.96]" : isSelected ? "scale-[1.05]" : "hover:scale-[1.02]"}
        ${selectedClassName ?? ""}
      `}
    >
      <div 
        className={`
          relative w-48 aspect-[4/5] rounded-lg overflow-hidden transition-all duration-200
          border-[4px] border-transparent
          ${isSelected
            ? "border-[#e879f9] ring-[4px] ring-[#e879f9] ring-offset-4 ring-offset-black shadow-[0_0_30px_rgba(232,121,249,0.9)]"
            : ""}
        `}
        style={{
          boxShadow: boxShadow,
          transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <LiquidMetalCard
          speed={isSelected || isHovered ? 0.6 : 0.25}
          className="w-full h-full !p-0 rounded-xl"
        >
          <div className="relative w-full h-full rounded-[calc(1rem-1px)] overflow-hidden bg-muted">
            {option.imageUrl ? (
              <Image
                src={option.imageUrl}
                alt={option.label}
                fill
                sizes="(min-width: 1024px) 160px, 128px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs font-medium">
                {option.label || "—"}
              </div>
            )}
          </div>
        </LiquidMetalCard>
      </div>
      <span className={`
        text-[20px] md:text-[20px] leading-tight font-medium tracking-wide transition-colors duration-200
        ${isSelected ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"}
     `}>
        {option.label}
      </span>
    </button>
  );
}

interface StyleCarouselProps {
  visible?: boolean;
  options?: TattooOption[];
  onSelect?: (option: TattooOption) => void;
  selected?: string | string[] | null;
  selectedClassName?: string;
  /** Center the row (e.g. for few color options) */
  centerAlign?: boolean;
  emptyMessage?: string;
}

export function StyleCarousel({
  visible = false,
  options,
  onSelect,
  selected,
  selectedClassName,
  centerAlign = false,
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
    <div className="mt-4 w-full min-w-0">
      <div className="scroll-touch-x hide-scrollbar scroll-smooth w-full">
        {/* Single row, horizontal scroll on all breakpoints (mobile + desktop) */}
        <div
          className={`flex flex-nowrap gap-4 md:gap-6 px-2 sm:px-4 py-[10px] w-max min-w-full ${centerAlign ? "justify-center" : ""}`}
        >
          {options.map((option, index) => {
            if (option.id === "premium") {
              return <PremiumCard key={`premium-${index}`} />;
            }

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
