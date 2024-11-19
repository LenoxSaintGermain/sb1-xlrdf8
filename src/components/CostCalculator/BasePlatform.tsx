import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BASE_PLANS } from './constants';
import { cn } from '@/lib/utils';
import type { BasePlan } from './types';

interface BasePlatformProps {
  selectedPlan: BasePlan;
  additionalUsers: number;
  onPlanChange: (plan: BasePlan) => void;
  onUsersChange: (users: number) => void;
}

export function BasePlatform({
  selectedPlan,
  additionalUsers,
  onPlanChange,
  onUsersChange,
}: BasePlatformProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Base Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedPlan}
          onValueChange={(value) => onPlanChange(value as BasePlan)}
          className="grid gap-4"
        >
          {Object.entries(BASE_PLANS).map(([key, plan]) => (
            <Label
              key={key}
              htmlFor={key}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedPlan === key
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-muted hover:border-muted-foreground/25"
              )}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={key} id={key} className="data-[state=checked]:border-primary data-[state=checked]:bg-primary" />
                <span>{plan.name}</span>
              </div>
              <span className="font-semibold">${plan.price}/month</span>
            </Label>
          ))}
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="additional-users">Additional Users (${8}/user/month)</Label>
          <Input
            id="additional-users"
            type="number"
            min="0"
            value={additionalUsers}
            onChange={(e) => onUsersChange(parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}