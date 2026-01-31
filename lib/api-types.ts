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
  imageUrl: string;
  isCustom?: boolean;
  group: "style" | "color" | "ratio" | "divider";
}
