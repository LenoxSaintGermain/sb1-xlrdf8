import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  OPENAI_MODELS,
  EMBEDDING_COSTS,
  ANTHROPIC_COSTS,
} from './constants';
import type { CalculatorState, OpenAIModel } from './types';

interface ProviderSelectionProps {
  state: CalculatorState;
  onChange: (newState: CalculatorState) => void;
}

function ModelOption({ 
  label, 
  description, 
  checked, 
  onCheckedChange,
  price,
}: { 
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  price: string;
}) {
  return (
    <label
      className={cn(
        "flex items-center justify-between p-3 rounded-md border-2 cursor-pointer transition-all hover:border-primary/50",
        checked ? "border-primary bg-primary/5" : "border-muted"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        />
        <div>
          <div>{label}</div>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{price}</div>
    </label>
  );
}

export function ProviderSelection({ state, onChange }: ProviderSelectionProps) {
  const updateState = (newState: Partial<CalculatorState>) => {
    onChange({ ...state, ...newState });
  };

  const toggleOpenAIModel = (modelKey: OpenAIModel, checked: boolean) => {
    const currentModels = state.providers.openai.selectedModels;
    const newModels = checked
      ? [...currentModels, modelKey]
      : currentModels.filter(m => m !== modelKey);
    
    updateState({
      providers: {
        ...state.providers,
        openai: {
          ...state.providers.openai,
          selectedModels: newModels,
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Providers
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Select the AI providers and models you want to use
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* OpenAI Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={state.providers.openai.enabled}
                onCheckedChange={(checked) =>
                  updateState({
                    providers: {
                      ...state.providers,
                      openai: {
                        ...state.providers.openai,
                        enabled: checked as boolean,
                      },
                    },
                  })
                }
              />
              <Label>OpenAI</Label>
            </div>
            
            {state.providers.openai.enabled && (
              <div className="ml-6 space-y-2">
                {Object.entries(OPENAI_MODELS).map(([key, model]) => (
                  <ModelOption
                    key={key}
                    label={model.name}
                    checked={state.providers.openai.selectedModels.includes(key as OpenAIModel)}
                    onCheckedChange={(checked) => toggleOpenAIModel(key as OpenAIModel, checked)}
                    price={`$${model.inputCost}/1M input, $${model.outputCost}/1M output`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Anthropic Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={state.providers.anthropic.enabled}
                onCheckedChange={(checked) =>
                  updateState({
                    providers: {
                      ...state.providers,
                      anthropic: {
                        enabled: checked as boolean,
                      },
                    },
                  })
                }
              />
              <Label>Anthropic Claude</Label>
            </div>
            {state.providers.anthropic.enabled && (
              <div className="ml-6 text-sm text-muted-foreground">
                ${ANTHROPIC_COSTS.inputCost}/1K input tokens, ${ANTHROPIC_COSTS.outputCost}/1K output tokens
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}