import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PRECONFIGURED_PROVIDERS } from './preconfigured-providers';
import type { CalculatorState, CustomProvider } from './types';

interface CustomProvidersProps {
  state: CalculatorState;
  onChange: (state: CalculatorState) => void;
}

export function CustomProviders({ state, onChange }: CustomProvidersProps) {
  const addPreconfiguredProvider = (provider: CustomProvider) => {
    onChange({
      ...state,
      customProviders: [...state.customProviders, { ...provider, enabled: true }],
    });
  };

  const toggleProviderEnabled = (providerId: string, enabled: boolean) => {
    onChange({
      ...state,
      customProviders: state.customProviders.map((provider) =>
        provider.id === providerId ? { ...provider, enabled } : provider
      ),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Providers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {PRECONFIGURED_PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              className="p-4 border rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={state.customProviders.some(
                      (p) => p.id === provider.id && p.enabled
                    )}
                    onCheckedChange={(checked) =>
                      checked
                        ? addPreconfiguredProvider(provider)
                        : toggleProviderEnabled(provider.id, false)
                    }
                  />
                  <div>
                    <Label>{provider.name}</Label>
                    {provider.description && (
                      <p className="text-sm text-muted-foreground">
                        {provider.description}
                      </p>
                    )}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to enable/disable this provider</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}