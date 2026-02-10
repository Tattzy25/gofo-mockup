"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CHROME_GLOW } from "@/components/ui/card";
import { TattooOption } from "@/lib/api-types";

const SUBSCRIBE_URL = "/subscribe";

/** Premium card: same height as style cards (w-48 aspect-[4/5]), Subscribe button below the card */
function PremiumCard() {
  return (
    <div className="flex flex-shrink-0 w-48 flex flex-col items-center gap-3" role="group" aria-label="Premium – subscribe for more styles">
      <Card
        className="relative w-48 aspect-[4/5] rounded-lg overflow-hidden !p-0 !py-0 !gap-0"
        style={{ boxShadow: CHROME_GLOW.default, transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <Image
            src="/PremiumCard.png"
            alt="Premium"
            fill
            sizes="192px"
            className="object-cover"
          />
        </div>
      </Card>
      <a
        href={SUBSCRIBE_URL}
        className="font-orbitron w-full py-2 rounded-full bg-white text-black font-bold text-xs text-center tracking-wide hover:bg-neutral-100 transition-colors shadow-md border border-black/10"
        aria-label="Subscribe now for more styles"
      >
        Subscribe Now
      </a>
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

  const boxShadow = isSelected
    ? CHROME_GLOW.selected
    : isHovered
      ? CHROME_GLOW.hover
      : CHROME_GLOW.default;

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
      <Card
        className="relative w-48 aspect-[4/5] rounded-lg overflow-hidden !p-0 !py-0 !gap-0"
        style={{
          boxShadow,
          transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden">
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
      </Card>
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
      <div className="mt-4 text-sm text-muted-foreground px-2">
        {emptyMessage ?? "No options available."}
      </div>
    );
  }

  return (
    <div className="mt-4 w-full min-w-0 scroll-touch-x hide-scrollbar scroll-smooth overflow-y-visible">
      <div
        className={`flex flex-nowrap gap-4 md:gap-6 px-2 sm:px-4 py-8 w-max min-w-full ${centerAlign ? "justify-center" : ""}`}
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
  );
}
