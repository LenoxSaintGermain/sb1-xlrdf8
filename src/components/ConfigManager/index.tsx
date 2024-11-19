import { useState } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlatformConfig } from './PlatformConfig';
import { ProviderConfig } from './ProviderConfig';
import { BusinessRulesConfig } from './BusinessRulesConfig';
import { PresetConfig } from './PresetConfig';
import type { ConfigState } from './types';

const defaultConfig: ConfigState = {
  platform: {
    plans: {
      starter: { name: 'Starter', price: 99, users: 5 },
      growth: { name: 'Growth', price: 149, users: 5 },
      professional: { name: 'Professional', price: 199, users: 5 },
    },
    additionalUserPrice: 8,
  },
  providers: {
    openai: {
      models: {
        'gpt4o': {
          name: 'GPT-4o',
          inputCost: 3.75,
          outputCost: 15,
          trainingCost: 25,
        },
        // ... other models
      },
      embeddings: {
        small: { standard: 0.02, batch: 0.01 },
        large: { standard: 0.13, batch: 0.065 },
      },
    },
    // ... other providers
  },
  businessRules: {
    roi: {
      averageHourlyRate: 75,
      hoursPerPage: 2,
      reviewCycleCost: 0.3,
      setupCost: 200,
    },
    tokenMetrics: {
      wordsPerToken: 0.75,
      wordsPerPage: 250,
      wordsPerMinute: 150,
      charsPerWord: 5,
    },
  },
  presets: [
    {
      id: 'basic-documentation',
      name: 'Basic Documentation',
      description: 'Suitable for small documentation projects',
      monthlyTokens: 500000,
      monthlyCharacters: 50000,
      providers: ['openai.gpt3-turbo'],
    },
    // ... other presets
  ],
};

export function ConfigManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigState>(defaultConfig);
  const [loading, setLoading] = useState(false);

  const loadConfig = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const configDoc = await getDoc(doc(db, 'config', 'global'));
      if (configDoc.exists()) {
        setConfig(configDoc.data() as ConfigState);
      }
    } catch (error) {
      toast({
        title: 'Error loading configuration',
        description: 'Failed to load configuration settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await setDoc(doc(db, 'config', 'global'), config);
      toast({
        title: 'Configuration saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error saving configuration',
        description: 'Failed to save configuration settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="platform">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="business">Business Rules</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>

            <TabsContent value="platform">
              <PlatformConfig
                config={config}
                onChange={setConfig}
              />
            </TabsContent>

            <TabsContent value="providers">
              <ProviderConfig
                config={config}
                onChange={setConfig}
              />
            </TabsContent>

            <TabsContent value="business">
              <BusinessRulesConfig
                config={config}
                onChange={setConfig}
              />
            </TabsContent>

            <TabsContent value="presets">
              <PresetConfig
                config={config}
                onChange={setConfig}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={loadConfig}
              disabled={loading}
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={saveConfig}
              disabled={loading}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}