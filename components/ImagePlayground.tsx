"use client";

import { useState } from "react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import { StyleCarousel } from "@/components/StyleCarousel";
import { PlaygroundControls } from "@/components/PlaygroundControls/PlaygroundControls";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
import { CustomStyleInput } from "@/components/CustomStyleInput/CustomStyleInput";
import {
  MODEL_CONFIGS,
  PROVIDERS,
  PROVIDER_ORDER,
  ProviderKey,
  ModelMode,
  initializeProviderRecord,
} from "@/lib/provider-config";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { Header } from "./Header";

export function ImagePlayground({}: {}) {
  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
  } = useImageGeneration();

  const [showProviders, setShowProviders] = useState(true);
  const [selectedModels, setSelectedModels] = useState<
    Record<ProviderKey, string>
  >(MODEL_CONFIGS.performance);
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true),
  );
  const [mode, setMode] = useState<ModelMode>("performance");
  const toggleView = () => {
    setShowProviders((prev) => !prev);
  };

  const [activeCarousel, setActiveCarousel] = useState<"style" | "vibe">("style");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null);
  const [customStyle, setCustomStyle] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [styleImages, setStyleImages] = useState<string[]>([]);
  const [stylesLoading, setStylesLoading] = useState(false);

  const vibeImages: string[] = [
    // Colors first
    "https://cdn.shopify.com/s/files/1/0649/4155/5787/files/BLACK_WHITE.png?v=1769632094",
    "https://cdn.shopify.com/s/files/1/0649/4155/5787/files/COLORFUL.png?v=1769632094",
    "https://cdn.shopify.com/s/files/1/0649/4155/5787/files/CUSTOM.png?v=1769726194",
    // Visual divider card
    "__divider__",
    // Aspect ratios
    "https://cdn.shopify.com/s/files/1/0649/4155/5787/files/9_16.png?v=1769631343",
    "https://cdn.shopify.com/s/files/1/0649/4155/5787/files/16_9.png?v=1769631343",
    "https://cdn.shopify.com/s/files/1/0649/4155/5787/files/1_1.png?v=1769631344",
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setStylesLoading(true);
      try {
        const module = await import("@/lib/style-images");
        const imgs = await module.fetchStyleImages();
        if (mounted) setStyleImages(imgs || []);
      } catch (err) {
        console.error("Failed to load style images:", err);
        if (mounted) setStyleImages([]);
      } finally {
        if (mounted) setStylesLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleModeChange = (newMode: ModelMode) => {
    setMode(newMode);
    setSelectedModels(MODEL_CONFIGS[newMode]);
    setShowProviders(true);
  };

  const handleModelChange = (providerKey: ProviderKey, model: string) => {
    setSelectedModels((prev) => ({ ...prev, [providerKey]: model }));
  };

  const handleProviderToggle = (provider: string, enabled: boolean) => {
    setEnabledProviders((prev) => ({
      ...prev,
      [provider]: enabled,
    }));
  };

  const providerToModel = {
    replicate: selectedModels.replicate,
  };

  const handlePromptSubmit = (newPrompt: string) => {
    const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
    if (activeProviders.length > 0) {
      // Append style tag if selected, but only for the API call
      let finalPrompt = newPrompt;
      if (selectedStyle) {
        if (selectedStyle.includes("CUSTOM")) {
          if (customStyle) {
            finalPrompt += ` [style:${customStyle}]`;
          }
        } else {
          finalPrompt += ` [style:${selectedStyle}]`;
        }
      }

      if (selectedColor) {
        if (selectedColor.includes("CUSTOM")) {
          if (customColor) {
            finalPrompt += ` [color:${customColor}]`;
          }
        } else {
          finalPrompt += ` [color:${selectedColor}]`;
        }
      }
      startGeneration(finalPrompt, activeProviders, providerToModel);
    }
    setShowProviders(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <PromptInput
          onSubmit={handlePromptSubmit}
          isLoading={isLoading}
          selectedStyle={
             selectedStyle?.includes("CUSTOM")
               ? (customStyle ? `Custom: ${customStyle}` : null)
               : selectedStyle
          }
          onClearStyle={() => {
            setSelectedStyle(null);
            setCustomStyle(null);
          }}
          selectedColor={selectedColor}
          onClearColor={() => setSelectedColor(null)}
          selectedRatio={selectedRatio}
          onClearRatio={() => setSelectedRatio(null)}
        />
        
        <PlaygroundControls
          mode={mode}
          onModeChange={handleModeChange}
          activeCarousel={activeCarousel}
          onCarouselChange={setActiveCarousel}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCarousel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <StyleCarousel
              visible={true}
              images={activeCarousel === "style" ? styleImages : vibeImages}
              onSelect={(url) => {
                if (activeCarousel === "style") {
                  setSelectedStyle(url);
                } else {
                  // Vibe logic: distinguish between color and ratio
                  if (url.includes("BLACK_WHITE") || url.includes("COLORFUL") || url.includes("CUSTOM")) {
                    setSelectedColor(url);
                  } else {
                    setSelectedRatio(url);
                  }
                }
              }}
              selected={
                activeCarousel === "style"
                  ? selectedStyle
                  : [selectedColor, selectedRatio].filter((s): s is string => !!s)
              }
              emptyMessage={
                activeCarousel === "style"
                  ? "No styles available."
                  : "No vibes available."
              }
            />
          </motion.div>
        </AnimatePresence>

        <CustomStyleInput
          isVisible={activeCarousel === "style" && !!selectedStyle?.includes("CUSTOM")}
          onSubmit={(style) => setCustomStyle(style)}
        />
        
        <CustomStyleInput
          isVisible={activeCarousel === "vibe" && !!selectedColor?.includes("CUSTOM")}
          onSubmit={(color) => setCustomColor(color)}
        />

        <>
          {(() => {
            const getModelProps = () =>
              (Object.keys(PROVIDERS) as ProviderKey[]).map((key) => {
                const provider = PROVIDERS[key];
                const providerImages = images.filter((img) => img.provider === key);
                const imageData = providerImages[0]?.image;
                const imageData2 = providerImages[1]?.image;
                const modelId = providerImages[0]?.modelId ?? "N/A";
                const timing = timings[key];

                return {
                  label: provider.displayName,
                  models: provider.models,
                  value: selectedModels[key],
                  providerKey: key,
                  onChange: (model: string, providerKey: ProviderKey) =>
                    handleModelChange(providerKey, model),
                  iconPath: provider.iconPath,
                  color: provider.color,
                  image: imageData,
                  image2: imageData2,
                  modelId,
                  timing,
                  failed: failedProviders.includes(key),
                };
              });

            return (
              <>
                <div className="md:hidden">
                  <ModelCardCarousel models={getModelProps()} />
                </div>
                <div className="hidden md:block md:w-full max-w-4xl mx-auto">
                  {getModelProps().map((props) => (
                    <ModelSelect key={props.label} {...props} />
                  ))}
                </div>
                {activePrompt && activePrompt.length > 0 && (
                  <div className="text-center mt-4 text-muted-foreground">
                    {activePrompt}
                  </div>
                )}
              </>
            );
          })()}
        </>
      </div>
    </div>
  );
}
