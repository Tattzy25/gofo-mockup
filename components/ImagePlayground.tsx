"use client";

import { useState } from "react";
import { useEffect } from "react";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import { StyleCarousel } from "@/components/StyleCarousel";
import { ModelCardCarousel } from "@/components/ModelCardCarousel";
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

  const [showStyles, setShowStyles] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [styleImages, setStyleImages] = useState<string[]>([]);
  const [stylesLoading, setStylesLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!showStyles) return;
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
  }, [showStyles]);

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
      startGeneration(newPrompt, activeProviders, providerToModel);
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
          showProviders={showProviders}
          onToggleProviders={toggleView}
          mode={mode}
          onModeChange={handleModeChange}
          onToggleStyles={() => setShowStyles((s) => !s)}
          selectedStyle={selectedStyle}
        />
        <StyleCarousel
          visible={showStyles}
          images={styleImages}
          onSelect={(url) => {
            setSelectedStyle(url);
          }}
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
