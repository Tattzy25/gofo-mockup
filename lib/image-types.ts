
import { ProviderKey } from "./provider-config";

export interface ImageResult {
  provider: ProviderKey;
  image: string | null;
  modelId: string;
}

export interface ImageError {
  provider: ProviderKey;
  error: string;
}

export interface ProviderTiming {
  startTime?: number;
  endTime?: number;
  duration?: number;
  completionTime?: number;
  elapsed?: number;
}
