import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BASE_PLANS, OPENAI_MODELS, EMBEDDING_COSTS, ANTHROPIC_COSTS, GEMINI_MODELS, ELEVENLABS_PLANS } from './constants';
import type { CalculatorState, CostBreakdown as CostBreakdownType } from './types';

interface CostRowProps {
  label: string;
  amount: number;
  isActive?: boolean;
  subItems?: { label: string; amount: number }[];
}

function CostRow({ label, amount, isActive = true, subItems }: CostRowProps) {
  return (
    <div className="space-y-1">
      <div className={`flex justify-between items-center py-1 ${isActive ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
        <span>{label}</span>
        <span className="font-mono">${amount.toFixed(2)}</span>
      </div>
      {subItems && subItems.length > 0 && (
        <div className="pl-4 space-y-1">
          {subItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{item.label}</span>
              <span className="font-mono">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CostBreakdownProps {
  state: CalculatorState;
}

export function CostBreakdown({ state }: CostBreakdownProps) {
  const calculateCosts = (): CostBreakdownType => {
    const basePlatformCost = BASE_PLANS[state.basePlan].price;
    const additionalUsersCost = state.additionalUsers * 8;

    // OpenAI costs
    const openaiCosts = {
      total: 0,
      models: {} as { [key: string]: number },
      embeddings: 0,
    };

    if (state.providers.openai.enabled) {
      state.providers.openai.selectedModels.forEach((model) => {
        const modelConfig = OPENAI_MODELS[model];
        const inputCost = (modelConfig.inputCost * state.monthlyTokens) / 1000000;
        const outputCost = (modelConfig.outputCost * state.monthlyTokens) / 1000000;
        openaiCosts.models[model] = inputCost + outputCost;
        openaiCosts.total += inputCost + outputCost;
      });

      if (state.providers.openai.useEmbeddings) {
        const embeddingConfig = EMBEDDING_COSTS[state.providers.openai.embeddingSize];
        const cost = state.providers.openai.batchEmbeddings ? embeddingConfig.batch : embeddingConfig.standard;
        openaiCosts.embeddings = (cost * state.monthlyTokens) / 1000000;
        openaiCosts.total += openaiCosts.embeddings;
      }
    }

    // Anthropic costs
    const anthropicCost = state.providers.anthropic.enabled
      ? ((ANTHROPIC_COSTS.inputCost + ANTHROPIC_COSTS.outputCost) * state.monthlyTokens) / 1000
      : 0;

    // Gemini costs
    const geminiCosts = {
      total: 0,
      models: {} as { [key: string]: number },
    };

    if (state.providers.gemini.enabled) {
      state.providers.gemini.selectedModels.forEach((model) => {
        const cost = (GEMINI_MODELS[model].cost * state.monthlyTokens) / 1000000;
        geminiCosts.models[model] = cost;
        geminiCosts.total += cost;
      });
    }

    // ElevenLabs costs
    const elevenLabsCosts = {
      total: 0,
      plans: {} as { [key: string]: number },
    };

    if (state.providers.elevenlabs.enabled) {
      state.providers.elevenlabs.selectedPlans.forEach((plan) => {
        elevenLabsCosts.plans[plan] = ELEVENLABS_PLANS[plan].price;
        elevenLabsCosts.total += ELEVENLABS_PLANS[plan].price;
      });
    }

    // Custom provider costs
    const customProviderCosts: { [key: string]: { total: number; subscription?: number; models: { [key: string]: number } } } = {};
    
    state.customProviders.forEach((provider) => {
      if (provider.enabled) {
        const providerCost = {
          total: 0,
          subscription: 0,
          models: {} as { [key: string]: number },
        };

        if (provider.hasSubscription) {
          provider.subscriptions.forEach((sub) => {
            if (sub.enabled) {
              providerCost.subscription = sub.price;
              providerCost.total += sub.price;
            }
          });
        }

        provider.models.forEach((model) => {
          if (model.enabled) {
            let modelCost = 0;
            if (model.costPerRequest) {
              const multiplier = model.requestUnit === 'million' ? 1000000 : model.requestUnit === 'thousand' ? 1000 : 1;
              modelCost += (model.costPerRequest * state.monthlyTokens) / multiplier;
            }
            if (model.costPerToken) {
              const multiplier = model.tokenUnit === 'million' ? 1000000 : model.tokenUnit === 'thousand' ? 1000 : 1;
              modelCost += (model.costPerToken * state.monthlyTokens) / multiplier;
            }
            providerCost.models[model.id] = modelCost;
            providerCost.total += modelCost;
          }
        });

        customProviderCosts[provider.id] = providerCost;
      }
    });

    const total = basePlatformCost + additionalUsersCost + openaiCosts.total + anthropicCost + 
                 geminiCosts.total + elevenLabsCosts.total + 
                 Object.values(customProviderCosts).reduce((sum, p) => sum + p.total, 0);

    return {
      basePlatform: basePlatformCost,
      additionalUsers: additionalUsersCost,
      openai: openaiCosts,
      anthropic: anthropicCost,
      gemini: geminiCosts,
      elevenlabs: elevenLabsCosts,
      customProviders: customProviderCosts,
      total,
    };
  };

  const costs = calculateCosts();

  const getOpenAISubItems = () => {
    const items: { label: string; amount: number }[] = [];
    
    Object.entries(costs.openai.models).forEach(([model, cost]) => {
      items.push({
        label: OPENAI_MODELS[model as keyof typeof OPENAI_MODELS].name,
        amount: cost,
      });
    });

    if (costs.openai.embeddings && costs.openai.embeddings > 0) {
      items.push({
        label: `${EMBEDDING_COSTS[state.providers.openai.embeddingSize].name} Embeddings${
          state.providers.openai.batchEmbeddings ? ' (Batch)' : ''
        }`,
        amount: costs.openai.embeddings,
      });
    }

    return items;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CostRow
          label={`Base Platform (${BASE_PLANS[state.basePlan].name})`}
          amount={costs.basePlatform}
        />
        
        {state.additionalUsers > 0 && (
          <CostRow
            label={`Additional Users (${state.additionalUsers})`}
            amount={costs.additionalUsers}
          />
        )}

        {state.providers.openai.enabled && costs.openai.total > 0 && (
          <CostRow
            label="OpenAI Services"
            amount={costs.openai.total}
            subItems={getOpenAISubItems()}
          />
        )}

        {state.providers.anthropic.enabled && (
          <CostRow
            label="Anthropic Claude"
            amount={costs.anthropic}
          />
        )}

        {state.providers.gemini.enabled && costs.gemini.total > 0 && (
          <CostRow
            label="Google Gemini"
            amount={costs.gemini.total}
            subItems={Object.entries(costs.gemini.models).map(([model, cost]) => ({
              label: GEMINI_MODELS[model as keyof typeof GEMINI_MODELS].name,
              amount: cost,
            }))}
          />
        )}

        {state.providers.elevenlabs.enabled && costs.elevenlabs.total > 0 && (
          <CostRow
            label="ElevenLabs Voice"
            amount={costs.elevenlabs.total}
            subItems={Object.entries(costs.elevenlabs.plans).map(([plan, cost]) => ({
              label: ELEVENLABS_PLANS[plan as keyof typeof ELEVENLABS_PLANS].name,
              amount: cost,
            }))}
          />
        )}

        {Object.entries(costs.customProviders).map(([providerId, providerCost]) => {
          const provider = state.customProviders.find(p => p.id === providerId);
          if (!provider || !provider.enabled) return null;

          const subItems: { label: string; amount: number }[] = [];
          
          if (providerCost.subscription) {
            subItems.push({
              label: 'Subscription',
              amount: providerCost.subscription,
            });
          }

          Object.entries(providerCost.models).forEach(([modelId, cost]) => {
            const model = provider.models.find(m => m.id === modelId);
            if (model) {
              subItems.push({
                label: model.name,
                amount: cost,
              });
            }
          });

          return (
            <CostRow
              key={providerId}
              label={provider.name}
              amount={providerCost.total}
              subItems={subItems}
            />
          );
        })}

        <div className="pt-4 mt-4 border-t">
          <div className="flex justify-between items-center font-semibold">
            <span>Total Monthly Cost</span>
            <span className="font-mono text-lg">${costs.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}