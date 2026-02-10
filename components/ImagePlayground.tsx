"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PromptInput } from "@/components/PromptInput";
import { StyleCarousel } from "@/components/StyleCarousel";
import { TATTOO_STYLES, MOCK_OUTPUT_STYLE_SLOTS } from "@/components/Tattoo-Styles/config";
import { TATTOO_COLORS } from "@/components/Tattoo Colors/config";
import { TattooOption } from "@/lib/api-types";
import { Card, CHROME_GLOW } from "@/components/ui/card";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { AnimatePresence, motion } from "framer-motion";

type MockStage = "selecting" | "generating" | "blocked";

function LoadingSquare() {
  return (
    <Card
      className="relative flex-1 min-w-0 aspect-square rounded-xl !p-0 !py-0 !gap-0 overflow-hidden bg-[var(--card)]"
      style={{ boxShadow: CHROME_GLOW.default }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color-mix(in_oklch,var(--foreground)_10%,transparent)] to-transparent animate-[shimmer_1.25s_infinite] [background-size:200%_100%]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-[color-mix(in_oklch,var(--foreground)_30%,transparent)] border-t-[color-mix(in_oklch,var(--foreground)_80%,transparent)] animate-spin" />
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
      className="relative flex-1 min-w-0 aspect-square rounded-xl !p-0 !py-0 !gap-0 overflow-hidden bg-[var(--card)]"
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
          <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--foreground)_35%,transparent)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[var(--muted)]" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <span className="text-sm font-medium tracking-wide select-none text-center text-[var(--muted-foreground)] opacity-90">
              {label}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}

export function ImagePlayground({}: {}) {
  const [promptInput, setPromptInput] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>("blackwork");
  const [selectedColorId, setSelectedColorId] = useState<string | null>("black-white");
  const [mockStage, setMockStage] = useState<MockStage>("selecting");

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

  const PREMIUM_OPTION: TattooOption = {
    id: "premium",
    label: "Premium",
    value: "premium",
    group: "style",
  };
  const PREMIUM_REPEAT = 28;
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
    const slots: Array<{ src?: string | null; alt: string; label: string }> = [];
    for (const c of TATTOO_COLORS) {
      slots.push({ src: c.imageUrl ?? null, alt: c.label, label: c.label });
    }
    const styleWithImages = styleOptions.filter((s) => !!s.imageUrl);
    for (const s of styleWithImages) {
      if (slots.length >= outputSlotCount) break;
      slots.push({ src: s.imageUrl ?? null, alt: s.label, label: s.label });
    }
    for (const s of styleOptions) {
      if (slots.length >= outputSlotCount) break;
      if (slots.some((x) => x.label === s.label)) continue;
      slots.push({ src: s.imageUrl ?? null, alt: s.label, label: s.label });
    }
    return slots.slice(0, outputSlotCount);
  }, [outputSlotCount, styleOptions]);

  const handlePromptSubmit = () => {
    setMockStage("generating");
  };

  useEffect(() => {
    if (mockStage !== "generating") return;
    const t = window.setTimeout(() => setMockStage("blocked"), 8000);
    return () => window.clearTimeout(t);
  }, [mockStage]);

  const getLabelForId = (id: string | null, options: TattooOption[]) => {
    if (!id) return null;
    const opt = options.find((o) => o.id === id);
    return opt?.label ?? null;
  };

  return (
    <div className="min-h-screen rounded-[40px] overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
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
                    width={300}
                    height={68}
                    textSize={24}
                    textFontFamily="var(--font-rock-salt)"
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
                className="relative mt-6 -mx-[10px] w-[calc(100%+20px)]"
              >
                <div className="relative">
                  <div
                    className={[
                      "flex w-full flex-nowrap gap-1 sm:gap-2",
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
                      <div className="rounded-2xl border border-[var(--border)] p-6 shadow-2xl backdrop-blur-xl bg-[color-mix(in_oklch,var(--background)_55%,transparent)]">
                        <Link href="/subscribe" className="inline-block" aria-label="Subscribe now to continue">
                          <LiquidMetalButton
                            label="SUBSCRIBE NOW TO CONTINUE"
                            viewMode="text"
                            animate={false}
                            interactive={false}
                            width={320}
                          />
                        </Link>
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