export interface PlatformPlan {
  name: string;
  price: number;
  users: number;
}

export interface PlatformConfig {
  plans: {
    starter: PlatformPlan;
    growth: PlatformPlan;
    professional: PlatformPlan;
  };
  additionalUserPrice: number;
}

export interface ModelConfig {
  name: string;
  inputCost: number;
  outputCost: number;
  trainingCost?: number;
}

export interface EmbeddingConfig {
  standard: number;
  batch: number;
}

export interface ProviderConfig {
  models: {
    [key: string]: ModelConfig;
  };
  embeddings?: {
    small: EmbeddingConfig;
    large: EmbeddingConfig;
  };
}

export interface ROIConfig {
  averageHourlyRate: number;
  hoursPerPage: number;
  reviewCycleCost: number;
  setupCost: number;
}

export interface TokenMetricsConfig {
  wordsPerToken: number;
  wordsPerPage: number;
  wordsPerMinute: number;
  charsPerWord: number;
}

export interface BusinessRulesConfig {
  roi: ROIConfig;
  tokenMetrics: TokenMetricsConfig;
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  monthlyTokens: number;
  monthlyCharacters: number;
  providers: string[];
}

export interface ConfigState {
  platform: PlatformConfig;
  providers: {
    [key: string]: ProviderConfig;
  };
  businessRules: BusinessRulesConfig;
  presets: PresetConfig[];
}