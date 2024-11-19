import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PRESET_SCENARIOS = [
  {
    name: 'Customer Support Bot',
    tokens: 500000,
    characters: 50000,
    description: 'Typical usage for a customer support chatbot handling ~1000 conversations/month',
  },
  {
    name: 'Content Generation',
    tokens: 2000000,
    characters: 200000,
    description: 'Suitable for generating ~500 articles or blog posts per month',
  },
  {
    name: 'Enterprise Assistant',
    tokens: 5000000,
    characters: 500000,
    description: 'For large-scale enterprise deployment with multiple concurrent users',
  },
];

interface UsageParametersProps {
  monthlyTokens: number;
  monthlyCharacters: number;
  onTokensChange: (tokens: number) => void;
  onCharactersChange: (chars: number) => void;
}

export function UsageParameters({
  monthlyTokens,
  monthlyCharacters,
  onTokensChange,
  onCharactersChange,
}: UsageParametersProps) {
  const formatValue = (value: number) => 
    value >= 1000000 
      ? `${(value / 1000000).toFixed(1)}M` 
      : value >= 1000 
        ? `${(value / 1000).toFixed(1)}K` 
        : value.toString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Usage Parameters
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Adjust these parameters based on your expected monthly usage.
                Use the presets as a starting point for common scenarios.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Monthly Tokens</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[monthlyTokens]}
                onValueChange={([value]) => onTokensChange(value)}
                min={100000}
                max={10000000}
                step={100000}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100K</span>
                <span>10M</span>
              </div>
            </div>
            <Input
              type="number"
              min="0"
              value={monthlyTokens}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  onTokensChange(value);
                }
              }}
              className="w-32"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Current: {formatValue(monthlyTokens)} tokens/month
          </div>
        </div>

        <div className="space-y-4">
          <Label>Monthly Characters (Voice)</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[monthlyCharacters]}
                onValueChange={([value]) => onCharactersChange(value)}
                min={10000}
                max={1000000}
                step={10000}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10K</span>
                <span>1M</span>
              </div>
            </div>
            <Input
              type="number"
              min="0"
              value={monthlyCharacters}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  onCharactersChange(value);
                }
              }}
              className="w-32"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Current: {formatValue(monthlyCharacters)} characters/month
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium">Quick Presets</h4>
          <div className="grid gap-2">
            {PRESET_SCENARIOS.map((scenario) => (
              <div
                key={scenario.name}
                className="flex items-center justify-between p-3 rounded-md border-2 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => {
                  onTokensChange(scenario.tokens);
                  onCharactersChange(scenario.characters);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onTokensChange(scenario.tokens);
                    onCharactersChange(scenario.characters);
                  }
                }}
              >
                <div>
                  <div className="font-medium">{scenario.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatValue(scenario.tokens)} tokens, {formatValue(scenario.characters)} chars
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{scenario.description}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}