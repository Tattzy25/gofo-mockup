"use client";

import { useEffect, useMemo, useState } from "react";
import { PromptInput } from "@/components/PromptInput";
import { StyleCarousel } from "@/components/StyleCarousel";
import { TATTOO_STYLES, MOCK_OUTPUT_STYLE_SLOTS } from "@/components/Tattoo-Styles/config";
import { TATTOO_COLORS } from "@/components/Tattoo Colors/config";
import { TattooOption } from "@/lib/api-types";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Card, CHROME_GLOW } from "@/components/ui/card";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type MockStage = "selecting" | "generating" | "blocked";

function LoadingSquare() {
  return (
    <Card
      className="relative w-40 sm:w-44 md:w-48 aspect-square rounded-2xl !p-0 !py-0 !gap-0 bg-black/40 overflow-hidden"
      style={{ boxShadow: CHROME_GLOW.default }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.25s_infinite] [background-size:200%_100%]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
      </div>
    </Card>
  );
}

function BlurredPresetSquare({
  src,
  alt,
  label,
}: {
  src?: string | null;
  alt: string;
  label: string;
}) {
  return (
    <Card
      className="relative w-40 sm:w-44 md:w-48 aspect-square rounded-2xl !p-0 !py-0 !gap-0 bg-black/40 overflow-hidden"
      style={{ boxShadow: CHROME_GLOW.default }}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="192px"
            className="object-cover blur-xl scale-110 opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(180,200,255,0.14),transparent_60%),linear-gradient(180deg,rgba(20,20,20,0.25),rgba(0,0,0,0.55))]" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-white/55 text-sm font-medium tracking-wide blur-[1px] select-none text-center">
              {label}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export function ImagePlayground({}: {}) {
  const [promptInput, setPromptInput] = useState("");
  
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const [mockStage, setMockStage] = useState<MockStage>("selecting");
  
  // Style options with Pexels images loaded (one horizontal row)
  const [styleOptions, setStyleOptions] = useState<TattooOption[]>(() =>
    TATTOO_STYLES.map((s) => ({ ...s }))
  );

  useEffect(() => {
    const styleOptionsToFetch = TATTOO_STYLES.filter(
      (s) => s.value && s.value !== "Custom" && !s.imageUrl
    );
    if (styleOptionsToFetch.length === 0) return;

    let cancelled = false;
    const fetchOne = async (option: TattooOption): Promise<{ id: string; imageUrl: string | null }> => {
      try {
        const res = await fetch(
          `/api/pexels/photo?style=${encodeURIComponent(option.value)}`
        );
        if (!res.ok) return { id: option.id, imageUrl: null };
        const data = await res.json();
        return { id: option.id, imageUrl: data.imageUrl ?? null };
      } catch {
        return { id: option.id, imageUrl: null };
      }
    };

    Promise.all(styleOptionsToFetch.map(fetchOne)).then((results) => {
      if (cancelled) return;
      setStyleOptions((prev) =>
        prev.map((opt) => {
          const found = results.find((r) => r.id === opt.id);
          if (!found) return opt;
          return { ...opt, imageUrl: found.imageUrl ?? undefined };
        })
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Premium teaser card (after 16 styles) + many copies for infinite-scroll feel
  const PREMIUM_OPTION: TattooOption = {
    id: "premium",
    label: "Premium",
    value: "premium",
    group: "style",
  };
  const PREMIUM_REPEAT = 300;
  const styleOptionsWithInfinitePremium: TattooOption[] = [
    ...styleOptions,
    PREMIUM_OPTION,
    ...Array(PREMIUM_REPEAT).fill(PREMIUM_OPTION),
  ];

  const outputSlotCount = useMemo(
    () => Math.max(1, TATTOO_COLORS.length + MOCK_OUTPUT_STYLE_SLOTS),
    [],
  );

  const blockedSlots = useMemo(() => {
    // Build the slots from existing exported options:
    // - start with colors (they always have local images)
    // - then take style cards (prefer ones with imageUrl already fetched)
    const slots: Array<{ src?: string | null; alt: string; label: string }> = [];

    for (const c of TATTOO_COLORS) {
      slots.push({
        src: c.imageUrl ?? null,
        alt: c.label,
        label: c.label,
      });
    }

    const styleWithImages = styleOptions.filter((s) => !!s.imageUrl);
    for (const s of styleWithImages) {
      if (slots.length >= outputSlotCount) break;
      slots.push({
        src: s.imageUrl ?? null,
        alt: s.label,
        label: s.label,
      });
    }

    // If we still don't have enough (before Pexels resolves), fill from styles by label only.
    for (const s of styleOptions) {
      if (slots.length >= outputSlotCount) break;
      if (slots.some((x) => x.label === s.label)) continue;
      slots.push({
        src: s.imageUrl ?? null,
        alt: s.label,
        label: s.label,
      });
    }

    return slots.slice(0, outputSlotCount);
  }, [outputSlotCount, styleOptions]);

  const handlePromptSubmit = () => {
    // Mock flow only: no real generation.
    setMockStage("generating");
  };

  useEffect(() => {
    if (mockStage !== "generating") return;
    const t = window.setTimeout(() => setMockStage("blocked"), 8000);
    return () => window.clearTimeout(t);
  }, [mockStage]);

  const getLabelForId = (id: string | null, options: TattooOption[]) => {
    if (!id) return null;
    const opt = options.find(o => o.id === id);
    return opt?.label || null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Prompt + controls area: full width with exactly 10px side padding */}
      <div className="px-[10px] pt-4">
        <div className="relative mb-4">
          <PromptInput
              value={promptInput}
              onChange={setPromptInput}
              onSubmit={handlePromptSubmit}
              selectedStyle={getLabelForId(selectedStyleId, TATTOO_STYLES)}
              onClearStyle={() => setSelectedStyleId(null)}
              selectedColorId={selectedColorId}
              onSelectColor={setSelectedColorId}
            />
        </div>
        <div className="mt-2 overflow-visible">
          <AnimatePresence mode="wait" initial={false}>
            {mockStage === "selecting" ? (
              <motion.div
                key="carousel"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Style carousel (16 styles + premium + repeated premium); glow and liquid metal not clipped */}
                <StyleCarousel
                  visible={true}
                  options={styleOptionsWithInfinitePremium}
                  onSelect={(option) => setSelectedStyleId(option.id)}
                  selected={selectedStyleId}
                  emptyMessage="No styles available."
                />

                <div className="flex justify-center py-10">
                  <LiquidMetalButton
                    label="INK ME UP"
                    onClick={handlePromptSubmit}
                    viewMode="text"
                    animate={true}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mock-output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative mt-6"
              >
                <div className="relative">
                  <div
                    className={[
                      "flex flex-nowrap gap-4 justify-center",
                      mockStage === "blocked" ? "blur-md" : "",
                    ].join(" ")}
                  >
                    {mockStage === "generating" &&
                      Array.from({ length: outputSlotCount }).map((_, i) => (
                        <LoadingSquare key={`loading-${i}`} />
                      ))}

                    {mockStage === "blocked" &&
                      blockedSlots.map((slot, i) => (
                        <BlurredPresetSquare
                          key={`${slot.label}-${i}`}
                          src={slot.src}
                          alt={slot.alt}
                          label={slot.label}
                        />
                      ))}
                  </div>

                  {mockStage === "blocked" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-2xl bg-black/55 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
                        <LiquidMetalButton
                          label="SUBSCRIBE NOW TO CONTINUE"
                          onClick={() => {
                            window.location.href = "/subscribe";
                          }}
                          viewMode="text"
                          animate={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
