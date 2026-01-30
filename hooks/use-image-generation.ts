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
    providers: ProviderKey[],
    providerToModel: Record<ProviderKey, string>,
  ) => {
    setActivePrompt(prompt);
    try {
      setIsLoading(true);
      // Initialize a fixed number of result slots (4) with null images
      const NUM_SLOTS = 4;
      const initialImages: ImageResult[] = Array.from({ length: NUM_SLOTS }).map((_, i) => {
        const provider = providers[i % providers.length];
        return {
          provider,
          image: null,
          modelId: providerToModel[provider],
        } as ImageResult;
      });
      setImages(initialImages);

      // Clear previous state
      setErrors([]);
      setFailedProviders([]);

      // Initialize timings with start times
      const now = Date.now();
      setTimings(
        Object.fromEntries(
          providers.map((provider) => [provider, { startTime: now }]),
        ) as Record<ProviderKey, ProviderTiming>,
      );

      // Helper to fetch a single slot (may reuse providers if fewer providers than slots)
      const generateImage = async (slotIndex: number, provider: ProviderKey, modelId: string) => {
        const startTime = Date.now();
        console.log(
          `Generate image request [slot=${slotIndex}, provider=${provider}, modelId=${modelId}]`,
        );
        try {
          const request = {
            prompt,
            provider,
            modelId,
          };

          // const response = await fetch("/api/generate-images", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(request),
          // });
          
          // Temporary switch to Dify endpoint
          const response = await fetch("https://api.dify.ai/mcp/server/u4cbxV8X77O1fKSZ/mcp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
          }

          const completionTime = Date.now();
          const elapsed = completionTime - startTime;
          setTimings((prev) => ({
            ...prev,
            [provider]: {
              startTime,
              completionTime,
              elapsed,
            },
          }));

          console.log(
            `Successful image response [provider=${provider}, modelId=${modelId}, elapsed=${elapsed}ms]`,
          );

          // Update the specific slot in state
          setImages((prevImages) =>
            prevImages.map((item, idx) =>
              idx === slotIndex ? { ...item, image: data.image ?? null, modelId } : item,
            ),
          );
        } catch (err) {
          console.error(
            `Error [slot=${slotIndex}, provider=${provider}, modelId=${modelId}]:`,
            err,
          );
          setFailedProviders((prev) => [...prev, provider]);
          setErrors((prev) => [
            ...prev,
            {
              provider,
              message:
                err instanceof Error
                  ? err.message
                  : "An unexpected error occurred",
            },
          ]);

          // Mark the slot as failed (image remains null)
          setImages((prevImages) =>
            prevImages.map((item, idx) =>
              idx === slotIndex ? { ...item, image: null, modelId } : item,
            ),
          );
        }
      };

      // Generate images for a fixed set of slots, distributing providers across slots
      const fetchPromises: Promise<void>[] = [];
      for (let slot = 0; slot < NUM_SLOTS; slot++) {
        const provider = providers[slot % providers.length];
        const modelId = providerToModel[provider];
        fetchPromises.push(generateImage(slot, provider, modelId));
      }

      await Promise.all(fetchPromises);
    } catch (error) {
      console.error("Error fetching images:", error);
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
