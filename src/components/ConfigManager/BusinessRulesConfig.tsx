import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ConfigState } from './types';

interface BusinessRulesConfigProps {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
}

export function BusinessRulesConfig({ config, onChange }: BusinessRulesConfigProps) {
  const updateROIConfig = (field: string, value: number) => {
    onChange({
      ...config,
      businessRules: {
        ...config.businessRules,
        roi: {
          ...config.businessRules.roi,
          [field]: value,
        },
      },
    });
  };

  const updateTokenMetrics = (field: string, value: number) => {
    onChange({
      ...config,
      businessRules: {
        ...config.businessRules,
        tokenMetrics: {
          ...config.businessRules.tokenMetrics,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ROI Calculations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Average Hourly Rate ($)</Label>
              <Input
                type="number"
                value={config.businessRules.roi.averageHourlyRate}
                onChange={(e) => updateROIConfig('averageHourlyRate', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Hours per Page</Label>
              <Input
                type="number"
                value={config.businessRules.roi.hoursPerPage}
                onChange={(e) => updateROIConfig('hoursPerPage', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Review Cycle Cost (% of base)</Label>
              <Input
                type="number"
                value={config.businessRules.roi.reviewCycleCost}
                onChange={(e) => updateROIConfig('reviewCycleCost', Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Setup Cost ($)</Label>
              <Input
                type="number"
                value={config.businessRules.roi.setupCost}
                onChange={(e) => updateROIConfig('setupCost', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Token Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Words per Token</Label>
              <Input
                type="number"
                value={config.businessRules.tokenMetrics.wordsPerToken}
                onChange={(e) => updateTokenMetrics('wordsPerToken', Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Words per Page</Label>
              <Input
                type="number"
                value={config.businessRules.tokenMetrics.wordsPerPage}
                onChange={(e) => updateTokenMetrics('wordsPerPage', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Words per Minute (Speech)</Label>
              <Input
                type="number"
                value={config.businessRules.tokenMetrics.wordsPerMinute}
                onChange={(e) => updateTokenMetrics('wordsPerMinute', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Characters per Word</Label>
              <Input
                type="number"
                value={config.businessRules.tokenMetrics.charsPerWord}
                onChange={(e) => updateTokenMetrics('charsPerWord', Number(e.target.value))}
                step="0.1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}