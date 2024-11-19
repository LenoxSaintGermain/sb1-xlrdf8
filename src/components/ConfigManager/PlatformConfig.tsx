import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ConfigState } from './types';

interface PlatformConfigProps {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
}

export function PlatformConfig({ config, onChange }: PlatformConfigProps) {
  const updatePlanPrice = (plan: string, price: number) => {
    onChange({
      ...config,
      platform: {
        ...config.platform,
        plans: {
          ...config.platform.plans,
          [plan]: {
            ...config.platform.plans[plan as keyof typeof config.platform.plans],
            price,
          },
        },
      },
    });
  };

  const updatePlanUsers = (plan: string, users: number) => {
    onChange({
      ...config,
      platform: {
        ...config.platform,
        plans: {
          ...config.platform.plans,
          [plan]: {
            ...config.platform.plans[plan as keyof typeof config.platform.plans],
            users,
          },
        },
      },
    });
  };

  const updateAdditionalUserPrice = (price: number) => {
    onChange({
      ...config,
      platform: {
        ...config.platform,
        additionalUserPrice: price,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(config.platform.plans).map(([key, plan]) => (
            <div key={key} className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium capitalize">{key} Plan</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${key}-price`}>Monthly Price ($)</Label>
                  <Input
                    id={`${key}-price`}
                    type="number"
                    value={plan.price}
                    onChange={(e) => updatePlanPrice(key, Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${key}-users`}>Included Users</Label>
                  <Input
                    id={`${key}-users`}
                    type="number"
                    value={plan.users}
                    onChange={(e) => updatePlanUsers(key, Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional User Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="additional-user-price">Price per Additional User ($)</Label>
            <Input
              id="additional-user-price"
              type="number"
              value={config.platform.additionalUserPrice}
              onChange={(e) => updateAdditionalUserPrice(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}