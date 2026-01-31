
export type ProviderKey = string;

export type ModelMode = "performance" | "quality";

export const PROVIDERS: Record<string, any> = {};

export const MODEL_CONFIGS: Record<ModelMode, Record<ProviderKey, string>> = {
  performance: {},
  quality: {},
};

export const PROVIDER_ORDER: ProviderKey[] = [];

export function initializeProviderRecord<T>(defaultValue?: any): Record<ProviderKey, T> {
  return {};
}
