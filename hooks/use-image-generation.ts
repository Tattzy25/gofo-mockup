import { useState } from "react";
import { ImageError, ImageResult, ProviderTiming } from "@/lib/image-types";
import { initializeProviderRecord, ProviderKey } from "@/lib/provider-config";

interface UseImageGenerationReturn {
  images: ImageResult[];
  errors: ImageError[];
  timings: Record<ProviderKey, ProviderTiming>;
  failedProviders: ProviderKey[];
  isLoading: boolean;
  startGeneration: (
    prompt: string,
    style: string | null,
    color: string | null,
    aspectRatio: string | null,
    providers: ProviderKey[],
    providerToModel: Record<ProviderKey, string>,
  ) => Promise<void>;
  resetState: () => void;
  activePrompt: string;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [errors, setErrors] = useState<ImageError[]>([]);
  const [timings, setTimings] = useState<Record<ProviderKey, ProviderTiming>>(
    initializeProviderRecord<ProviderTiming>(),
  );
  const [failedProviders, setFailedProviders] = useState<ProviderKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState("");

  const resetState = () => {
    setImages([]);
    setErrors([]);
    setTimings(initializeProviderRecord<ProviderTiming>());
    setFailedProviders([]);
    setIsLoading(false);
  };

  const startGeneration = async (
    prompt: string,
    style: string | null,
    color: string | null,
    aspectRatio: string | null,
    providers: ProviderKey[],
    providerToModel: Record<ProviderKey, string>,
  ) => {
    setActivePrompt(prompt);
    setIsLoading(true);
    setErrors([]);
    setFailedProviders([]);
    
    // Reset images/timings
    setImages([]);
    const startTime = Date.now();
    const provider = providers[0] || "default";
    
    setTimings({
        [provider]: { startTime }
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          style,
          color,
          ratio: aspectRatio,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate image');
      }

      const completionTime = Date.now();
      setTimings(prev => ({
        ...prev,
        [provider]: {
          startTime,
          completionTime,
          elapsed: completionTime - startTime
        }
      }));

      // Handle Dify Response Structure
      let newImages: Array<{ provider: ProviderKey; image: string; modelId: string }> = [];

      if (data && data.data && data.data.outputs) {
          const outputs = data.data.outputs;
          
          // Check for file list first (handling multiple images)
          if (Array.isArray(outputs.files) && outputs.files.length > 0) {
            newImages = outputs.files.map((file: any) => ({
              provider,
              image: file.url,
              modelId: providerToModel[provider] || "dify",
            }));
          } 
          // Single image string
          else if (typeof outputs.image === 'string') {
             newImages.push({ provider, image: outputs.image, modelId: providerToModel[provider] || "dify" });
          }
          // Single url string
          else if (typeof outputs.url === 'string') {
             newImages.push({ provider, image: outputs.url, modelId: providerToModel[provider] || "dify" });
          }
          // Text fallback
          else if (typeof outputs.text === 'string' && outputs.text.startsWith('http')) {
             newImages.push({ provider, image: outputs.text, modelId: providerToModel[provider] || "dify" });
          }
      }

      if (newImages.length > 0) {
        setImages(newImages);
      } else {
        // No valid images found - Fail hard
        console.error("Dify response contained no valid images:", data);
        throw new Error("No images were generated. Please try again later.");
      }

    } catch (err: any) {
      console.error("Generation Error:", err);
      setFailedProviders([provider]);
      setErrors([{
        provider,
        error: err.message || "Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
    errors,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    resetState,
    activePrompt,
  };
}
