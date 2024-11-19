export type BasePlan = 'starter' | 'growth' | 'professional';

export type OpenAIModel = 'gpt4o' | 'gpt4o-mini' | 'gpt4-turbo' | 'gpt3-turbo';
export type EmbeddingSize = 'small' | 'large';
export type ElevenLabsPlan = 'basic' | 'pro' | 'enterprise';
export type GeminiModel = 'pro' | 'flash';

export interface CustomProviderModel {
  id: string;
  name: string;
  costPerRequest?: number;
  requestUnit?: 'request' | 'thousand' | 'million';
  costPerToken?: number;
  tokenUnit?: 'token' | 'thousand' | 'million';
  enabled: boolean;
}

export interface CustomProviderSubscription {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  enabled: boolean;
}

export interface CustomProvider {
  id: string;
  name: string;
  description?: string;
  hasSubscription: boolean;
  subscriptions: CustomProviderSubscription[];
  hasApi: boolean;
  models: CustomProviderModel[];
  enabled: boolean;
}

export interface CalculatorState {
  basePlan: BasePlan;
  additionalUsers: number;
  monthlyTokens: number;
  monthlyCharacters: number;
  providers: {
    openai: {
      enabled: boolean;
      selectedModels: OpenAIModel[];
      useEmbeddings: boolean;
      embeddingSize: EmbeddingSize;
      batchEmbeddings: boolean;
    };
    anthropic: {
      enabled: boolean;
    };
    gemini: {
      enabled: boolean;
      selectedModels: GeminiModel[];
    };
    elevenlabs: {
      enabled: boolean;
      selectedPlans: ElevenLabsPlan[];
    };
  };
  customProviders: CustomProvider[];
}

export interface CostBreakdown {
  basePlatform: number;
  additionalUsers: number;
  openai: {
    total: number;
    models: { [key in OpenAIModel]?: number };
    embeddings?: number;
  };
  anthropic: number;
  gemini: {
    total: number;
    models: { [key in GeminiModel]?: number };
  };
  elevenlabs: {
    total: number;
    plans: { [key in ElevenLabsPlan]?: number };
  };
  customProviders: {
    [key: string]: {
      total: number;
      subscription?: number;
      models: { [key: string]: number };
    };
  };
  total: number;
}