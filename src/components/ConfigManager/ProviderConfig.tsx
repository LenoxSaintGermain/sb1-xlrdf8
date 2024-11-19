import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ConfigState, ModelConfig } from './types';

interface ProviderConfigProps {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
}

export function ProviderConfig({ config, onChange }: ProviderConfigProps) {
  const [newModel, setNewModel] = useState<ModelConfig>({
    name: '',
    inputCost: 0,
    outputCost: 0,
  });

  const updateModelCost = (provider: string, model: string, field: keyof ModelConfig, value: number) => {
    onChange({
      ...config,
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider],
          models: {
            ...config.providers[provider].models,
            [model]: {
              ...config.providers[provider].models[model],
              [field]: value,
            },
          },
        },
      },
    });
  };

  const addModel = (provider: string) => {
    const modelKey = newModel.name.toLowerCase().replace(/\s+/g, '-');
    onChange({
      ...config,
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider],
          models: {
            ...config.providers[provider].models,
            [modelKey]: newModel,
          },
        },
      },
    });
    setNewModel({ name: '', inputCost: 0, outputCost: 0 });
  };

  const removeModel = (provider: string, model: string) => {
    const newModels = { ...config.providers[provider].models };
    delete newModels[model];
    onChange({
      ...config,
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider],
          models: newModels,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {Object.entries(config.providers).map(([provider, providerConfig]) => (
        <Card key={provider}>
          <CardHeader>
            <CardTitle className="capitalize">{provider}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(providerConfig.models).map(([modelKey, model]) => (
                <div key={modelKey} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{model.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModel(provider, modelKey)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Input Cost (per 1M tokens)</Label>
                      <Input
                        type="number"
                        value={model.inputCost}
                        onChange={(e) => updateModelCost(provider, modelKey, 'inputCost', Number(e.target.value))}
                        step="0.0001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Output Cost (per 1M tokens)</Label>
                      <Input
                        type="number"
                        value={model.outputCost}
                        onChange={(e) => updateModelCost(provider, modelKey, 'outputCost', Number(e.target.value))}
                        step="0.0001"
                      />
                    </div>
                    {model.trainingCost !== undefined && (
                      <div className="space-y-2">
                        <Label>Training Cost (per 1M tokens)</Label>
                        <Input
                          type="number"
                          value={model.trainingCost}
                          onChange={(e) => updateModelCost(provider, modelKey, 'trainingCost', Number(e.target.value))}
                          step="0.0001"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Model
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Model</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Model Name</Label>
                      <Input
                        value={newModel.name}
                        onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Input Cost (per 1M tokens)</Label>
                      <Input
                        type="number"
                        value={newModel.inputCost}
                        onChange={(e) => setNewModel({ ...newModel, inputCost: Number(e.target.value) })}
                        step="0.0001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Output Cost (per 1M tokens)</Label>
                      <Input
                        type="number"
                        value={newModel.outputCost}
                        onChange={(e) => setNewModel({ ...newModel, outputCost: Number(e.target.value) })}
                        step="0.0001"
                      />
                    </div>
                    <Button
                      onClick={() => addModel(provider)}
                      disabled={!newModel.name}
                      className="w-full"
                    >
                      Add Model
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}