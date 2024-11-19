export const BASE_PLANS = {
  starter: { name: 'Starter', price: 99, users: 5 },
  growth: { name: 'Growth', price: 149, users: 5 },
  professional: { name: 'Professional', price: 199, users: 5 },
};

export const OPENAI_MODELS = {
  'gpt4o': {
    name: 'GPT-4o',
    inputCost: 3.75,
    outputCost: 15,
    trainingCost: 25,
  },
  'gpt4o-mini': {
    name: 'GPT-4o Mini',
    inputCost: 0.30,
    outputCost: 1.20,
    trainingCost: 3,
  },
  'gpt4-turbo': {
    name: 'GPT-4 Turbo',
    inputCost: 0.01,
    outputCost: 0.03,
  },
  'gpt3-turbo': {
    name: 'GPT-3.5 Turbo',
    inputCost: 0.0005,
    outputCost: 0.0015,
  },
};

export const EMBEDDING_COSTS = {
  small: {
    name: 'Small',
    standard: 0.02,
    batch: 0.01,
  },
  large: {
    name: 'Large',
    standard: 0.13,
    batch: 0.065,
  },
};

export const ANTHROPIC_COSTS = {
  inputCost: 0.015,
  outputCost: 0.075,
};

export const GEMINI_MODELS = {
  pro: {
    name: 'Pro',
    cost: 7,
  },
  flash: {
    name: 'Flash',
    cost: 0.35,
  },
};

export const ELEVENLABS_PLANS = {
  basic: {
    name: 'Basic',
    price: 22,
    characters: 50000,
  },
  pro: {
    name: 'Pro',
    price: 99,
    characters: 250000,
  },
  enterprise: {
    name: 'Enterprise',
    price: 330,
    characters: 1000000,
  },
};