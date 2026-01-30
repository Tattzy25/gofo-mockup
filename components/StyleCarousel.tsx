"use client";

import React from "react";
import Image from "next/image";

interface StyleCarouselProps {
  visible?: boolean;
  images?: string[]; // dynamic list of style image URLs
  onSelect?: (url: string) => void;
  /** Optional externally-controlled selected image URL(s) */
  selected?: string | string[] | null;
  /** Optional class applied to a selected item (consumer may style via data-selected instead) */
  selectedClassName?: string;
  emptyMessage?: string;
}

export function StyleCarousel({
  visible = false,
  images,
  onSelect,
  selected,
  selectedClassName,
  emptyMessage,
}: Readonly<StyleCarouselProps>) {
  const [internalSelected, setInternalSelected] = React.useState<string | null>(null);
  const [hiddenMap, setHiddenMap] = React.useState<Record<string, boolean>>({});

  if (!visible) return null;

  if (!images || images.length === 0) {
    return (
      <div className="mt-4">
        <div className="text-sm text-muted-foreground px-2">
          {emptyMessage ?? "No style images available."}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 px-4 py-[10px]">
          {images.map((src, idx) => {
            // Special sentinel for rendering a half-empty white divider card
            if (src === "__divider__") {
              return (
                <div
                  key={`divider-${idx}`}
                  className="flex-shrink-0 w-32 aspect-[4/5] rounded-lg bg-white border border-dashed border-zinc-200 relative overflow-hidden"
                >
                  <Image
                    src="https://cdn.shopify.com/s/files/1/0649/4155/5787/files/choose.png?v=1769632947"
                    alt="Choose"
                    fill
                    sizes="(min-width: 1024px) 160px, 128px"
                    className="object-contain"
                  />
                </div>
              );
            }

            if (hiddenMap[src]) return null;

            const getLabel = (url: string) => {
              try {
                const path = new URL(url).pathname;
                const raw = path.split("/").pop() || "";
                const name = raw.split(".")[0] || raw;
                return name
                  .replace(/[_-]+/g, " ")
                  .split(" ")
                  .map(
                    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                  )
                  .join(" ");
              } catch (e) {
                return "";
              }
            };

            const label = getLabel(src);

            const selectedSrc = selected ?? internalSelected;

            const handleClick = () => {
              setInternalSelected(src);
              onSelect?.(src);
            };

            // We intentionally do NOT hard-code the visual highlight here.
            // Consumers can style via the `data-selected="true"` attribute or pass `selectedClassName`.
            const isSelected = Array.isArray(selectedSrc)
              ? selectedSrc.includes(src)
              : selectedSrc === src;

            return (
              <button
                key={src}
                onClick={handleClick}
                aria-label={`Select style ${idx + 1}`}
                data-selected={isSelected ? "true" : undefined}
                className={`
                  group relative flex-shrink-0 w-32 aspect-[4/5] rounded-lg overflow-hidden transition-all duration-200
                  ${isSelected ? "ring-2 ring-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.3)] scale-[1.02]" : "hover:scale-[1.02]"}
                  ${selectedClassName ?? ""}
                `}
              >
                <Image
                  src={src}
                  alt={`Style ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 160px, 128px"
                  className="object-cover"
                  onError={() => {
                    setHiddenMap((prev) => ({ ...prev, [src]: true }));
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
