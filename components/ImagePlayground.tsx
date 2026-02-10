"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptInput } from "@/components/PromptInput";
import { StyleCarousel } from "@/components/StyleCarousel";
import { ProviderKey } from "@/lib/provider-config";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import ModernLoader from "@/components/ui/modern-loader";
import { useToast } from "@/hooks/use-toast";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { 
  TATTOO_STYLES 
} from "@/components/Tattoo-Styles/config";
import { 
  TATTOO_COLORS 
} from "@/components/Tattoo Colors/config";
import { TattooOption } from "@/lib/api-types";

export function ImagePlayground({}: {}) {
  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
    errors,
  } = useImageGeneration();

  const [promptInput, setPromptInput] = useState("");
  
  // Initialize with defaults as requested ("except the defaults that I have")
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedRatioId, setSelectedRatioId] = useState<string | null>("ratio-1-1");
  
  
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
  const PREMIUM_REPEAT = 28;
  const styleOptionsWithInfinitePremium: TattooOption[] = [
    ...styleOptions,
    PREMIUM_OPTION,
    ...Array(PREMIUM_REPEAT).fill(PREMIUM_OPTION),
  ];

  // Color options only for mockup (no aspect ratios); center-aligned
  const colorOptions: TattooOption[] = TATTOO_COLORS;

  const { toast } = useToast();

  // Surface backend / generation errors to the user instead of failing silently
  useEffect(() => {
    if (!errors || errors.length === 0) return;

    const firstError = errors[0];

    toast({
      title: "Image generation failed",
      description: firstError.error || "Something went wrong while generating your tattoo image.",
      variant: "destructive",
    });
  }, [errors, toast]);

  const handlePromptSubmit = () => {
    const newPrompt = promptInput;
    
    // Validation Gates
    if (!selectedStyleId) {
      toast({
        title: "Missing Style",
        description: "Please select a tattoo style to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColorId) {
      toast({
        title: "Missing Color",
        description: "Please select a color preference.",
        variant: "destructive",
      });
      return;
    }

    if (!newPrompt || newPrompt.trim().length < 10) {
      toast({
        title: "Answer Too Short",
        description: "Your answer must be at least 10 characters long to generate a meaningful design.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedStyle = TATTOO_STYLES.find(s => s.id === selectedStyleId);
    const selectedColor = TATTOO_COLORS.find(c => c.id === selectedColorId);

    const finalStyle = selectedStyle?.value ?? null;
    const finalColor = selectedColor?.value ?? null;
    const finalRatio = "1:1"; // mockup: fixed ratio

    console.log("Submitting Generation Request:", { 
        prompt: newPrompt, 
        style: finalStyle, 
        color: finalColor, 
        ratio: finalRatio 
    });

    // Single provider, no fallbacks
    const providers: ProviderKey[] = ["default"]; 
    const providerToModel: Record<ProviderKey, string> = {
        default: "dify-workflow",
    };

    startGeneration(
      newPrompt,
      finalStyle,
      finalColor,
      finalRatio,
      providers,
      providerToModel
    );
  };

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
          <div>
            <PromptInput
              value={promptInput}
              onChange={setPromptInput}
              onSubmit={handlePromptSubmit}
              isLoading={isLoading}
              selectedStyle={getLabelForId(selectedStyleId, TATTOO_STYLES)}
              onClearStyle={() => setSelectedStyleId(null)}
              selectedColor={getLabelForId(selectedColorId, TATTOO_COLORS)}
              onClearColor={() => setSelectedColorId(null)}
              selectedRatio={null}
              onClearRatio={() => {}}
            />
          </div>
        </div>
        <div className="mt-2 space-y-4">
          {/* Always-rendered Style carousel (16 styles + premium + repeated premium for infinite feel) */}
          <StyleCarousel
            visible={true}
            options={styleOptionsWithInfinitePremium}
            onSelect={(option) => {
              setSelectedStyleId(option.id);
            }}
            selected={selectedStyleId}
            emptyMessage="No styles available."
          />

          {/* Color options only (B&W, Full Color, Custom) – center-aligned, liquid metal cards, click-to-highlight */}
          <StyleCarousel
            visible={true}
            options={colorOptions}
            onSelect={(option) => {
              if (option.group === "color") setSelectedColorId(option.id);
            }}
            selected={selectedColorId}
            centerAlign
            emptyMessage="No options available."
          />
        </div>

        <div className="flex justify-center my-20 py-12 relative z-10">
          <div className={isLoading ? "opacity-50 pointer-events-none scale-[1.75] origin-center" : "scale-[1.75] origin-center"}>
            <LiquidMetalButton
              label={isLoading ? "INKING..." : "INK ME UP"}
              onClick={handlePromptSubmit}
              viewMode="text"
            />
          </div>
        </div>
      </div>

      {/* Image display area: keep layout, but overlay 2FACE.jpg with rounded corners while loading */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="relative max-w-4xl mx-auto mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
            {images.length === 0 ? (
              // Render placeholders if no images (e.g. initial state)
              [0, 1].map((idx) => (
                <ImageDisplay
                  key={`placeholder-${idx}`}
                  provider={`Slot ${idx + 1}`}
                  image={null}
                  modelId=""
                  failed={false}
                />
              ))
            ) : (
              images.map((img, idx) => (
                <ImageDisplay
                  key={idx}
                  provider={img.provider}
                  image={img.image}
                  modelId={img.modelId}
                  timing={timings[img.provider]}
                  failed={failedProviders.includes(img.provider)}
                />
              ))
            )}
          </div>

          {/* Idle state overlay: show 2FACE image until generation starts */}
          <AnimatePresence>
            {images.length === 0 && !isLoading && (
              <motion.div
                key="idle-2face"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center z-20"
              >
                <Image
                  src="/2FACE.jpg"
                  alt="Tattoo preview"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state overlay: fade in ModernLoader while images generate */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loader-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl overflow-hidden bg-black/90 flex items-center justify-center z-30"
              >
                <ModernLoader />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activePrompt && activePrompt.length > 0 && (
          <div className="text-center mt-4 text-muted-foreground">
            {activePrompt}
          </div>
        )}
      </div>
    </div>
  );
}
