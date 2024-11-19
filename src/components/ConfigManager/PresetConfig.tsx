import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ConfigState, PresetConfig as PresetConfigType } from './types';

interface PresetConfigProps {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
}

export function PresetConfig({ config, onChange }: PresetConfigProps) {
  const [newPreset, setNewPreset] = useState<Omit<PresetConfigType, 'id'>>({
    name: '',
    description: '',
    monthlyTokens: 0,
    monthlyCharacters: 0,
    providers: [],
  });

  const addPreset = () => {
    const id = newPreset.name.toLowerCase().replace(/\s+/g, '-');
    onChange({
      ...config,
      presets: [
        ...config.presets,
        {
          ...newPreset,
          id,
        },
      ],
    });
    setNewPreset({
      name: '',
      description: '',
      monthlyTokens: 0,
      monthlyCharacters: 0,
      providers: [],
    });
  };

  const removePreset = (id: string) => {
    onChange({
      ...config,
      presets: config.presets.filter((preset) => preset.id !== id),
    });
  };

  const updatePreset = (id: string, updates: Partial<PresetConfigType>) => {
    onChange({
      ...config,
      presets: config.presets.map((preset) =>
        preset.id === id ? { ...preset, ...updates } : preset
      ),
    });
  };

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Preset
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preset Name</Label>
              <Input
                value={newPreset.name}
                onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newPreset.description}
                onChange={(e) => setNewPreset({ ...newPreset, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Tokens</Label>
              <Input
                type="number"
                value={newPreset.monthlyTokens}
                onChange={(e) => setNewPreset({ ...newPreset, monthlyTokens: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Monthly Characters</Label>
              <Input
                type="number"
                value={newPreset.monthlyCharacters}
                onChange={(e) => setNewPreset({ ...newPreset, monthlyCharacters: Number(e.target.value) })}
              />
            </div>
            <Button
              onClick={addPreset}
              disabled={!newPreset.name}
              className="w-full"
            >
              Add Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {config.presets.map((preset) => (
          <Card key={preset.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{preset.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePreset(preset.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={preset.description}
                  onChange={(e) => updatePreset(preset.id, { description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Monthly Tokens</Label>
                  <Input
                    type="number"
                    value={preset.monthlyTokens}
                    onChange={(e) => updatePreset(preset.id, { monthlyTokens: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Characters</Label>
                  <Input
                    type="number"
                    value={preset.monthlyCharacters}
                    onChange={(e) => updatePreset(preset.id, { monthlyCharacters: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}