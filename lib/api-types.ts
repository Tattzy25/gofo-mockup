import { ProviderKey } from "./provider-config";

export interface GenerateImageRequest {
  prompt: string;
  provider: ProviderKey;
  modelId: string;
  style?: string | null;
  color?: string | null;
  aspectRatio?: string | null;
}

export interface GenerateImageResponse {
  image?: string;
  error?: string;
}

export interface TattooOption {
  id: string;
  label: string;
  value: string; // The value sent to the API
  /**
   * UI preview image for the option.
   * NOTE: In the mockup we populate this dynamically from Pexels, so it may be null/undefined at first render.
   */
  imageUrl?: string | null;
  isCustom?: boolean;
  group: "style" | "color" | "ratio" | "divider";
}
