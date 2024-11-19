import type { CustomProvider } from './types';

export const PERPLEXITY_AI: CustomProvider = {
  id: 'perplexity',
  name: 'Perplexity AI',
  description: 'Advanced AI platform with subscription and API access options',
  hasSubscription: true,
  subscriptions: [
    {
      id: 'pro-monthly',
      name: 'Pro (Monthly)',
      price: 20,
      billingPeriod: 'monthly',
      features: [
        '300 Pro searches daily',
        'Advanced AI models access',
        'File analysis (PDF, CSV, images)',
        'Unlimited file uploads',
        'API access',
        'Image generation tools',
      ],
      enabled: false,
    },
    {
      id: 'pro-yearly',
      name: 'Pro (Yearly)',
      price: 200,
      billingPeriod: 'yearly',
      features: [
        'All Pro features',
        '$40 annual savings',
      ],
      enabled: false,
    },
  ],
  hasApi: true,
  models: [
    {
      id: 'sonar-small-online',
      name: 'Sonar Small (Online)',
      costPerRequest: 5,
      requestUnit: 'thousand',
      costPerToken: 0.2,
      tokenUnit: 'million',
      enabled: false,
    },
    {
      id: 'sonar-large-online',
      name: 'Sonar Large (Online)',
      costPerRequest: 5,
      requestUnit: 'thousand',
      costPerToken: 1,
      tokenUnit: 'million',
      enabled: false,
    },
    {
      id: 'sonar-huge-online',
      name: 'Sonar Huge (Online)',
      costPerRequest: 5,
      requestUnit: 'thousand',
      costPerToken: 5,
      tokenUnit: 'million',
      enabled: false,
    },
    {
      id: 'sonar-small-chat',
      name: 'Sonar Small (Chat)',
      costPerToken: 0.2,
      tokenUnit: 'million',
      enabled: false,
    },
    {
      id: 'sonar-large-chat',
      name: 'Sonar Large (Chat)',
      costPerToken: 1,
      tokenUnit: 'million',
      enabled: false,
    },
    {
      id: 'llama-8b',
      name: 'Llama 3.1 8B',
      costPerToken: 0.2,
      tokenUnit: 'million',
      enabled: false,
    },
    {
      id: 'llama-70b',
      name: 'Llama 3.1 70B',
      costPerToken: 1,
      tokenUnit: 'million',
      enabled: false,
    },
  ],
  enabled: false,
};

export const PRECONFIGURED_PROVIDERS = [
  PERPLEXITY_AI,
  // Add more preconfigured providers here
];