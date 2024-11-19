import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CostBreakdown } from './types';

// Custom axis components with default parameters instead of defaultProps
function CustomXAxis({ 
  dataKey = 'month',
  axisLine = false,
  tickLine = false,
  ...props 
}: any) {
  return (
    <g className="recharts-cartesian-axis recharts-xaxis">
      {props.ticks?.map((entry: any, index: number) => (
        <text
          key={index}
          x={entry.x}
          y={entry.y + 10}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
        >
          {entry.value}
        </text>
      ))}
    </g>
  );
}

function CustomYAxis({ 
  axisLine = false,
  tickLine = false,
  ...props 
}: any) {
  return (
    <g className="recharts-cartesian-axis recharts-yaxis">
      {props.ticks?.map((entry: any, index: number) => (
        <text
          key={index}
          x={entry.x - 10}
          y={entry.y}
          textAnchor="end"
          fill="currentColor"
          fontSize={12}
        >
          ${entry.value.toLocaleString()}
        </text>
      ))}
    </g>
  );
}

interface BusinessInsightsProps {
  costs: CostBreakdown;
  monthlyTokens: number;
}

export function BusinessInsights({ costs, monthlyTokens }: BusinessInsightsProps) {
  // Calculate annual costs with 10% projected growth per quarter
  const annualForecast = Array.from({ length: 12 }, (_, i) => {
    const quarterGrowth = Math.pow(1.1, Math.floor(i / 3));
    const monthCost = costs.total * quarterGrowth;
    const monthTokens = monthlyTokens * quarterGrowth;
    
    return {
      month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
      cost: monthCost,
      tokens: monthTokens,
    };
  });

  // Calculate ROI metrics based on industry averages
  const monthlyTimesSaved = Math.round((monthlyTokens * 0.75) / 250 * 2); // Approx. 2 hours saved per page
  const monthlyLaborCost = 75; // Average hourly rate for medical writers
  const monthlySavings = monthlyTimesSaved * monthlyLaborCost;
  const annualSavings = monthlySavings * 12;
  const roi = ((annualSavings - (costs.total * 12)) / (costs.total * 12)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">Cost Forecast</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={annualForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis dataKey="month" />
                  <CustomYAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">Forecast Assumptions:</p>
              <ul className="list-disc ml-4 text-sm text-muted-foreground">
                <li>10% quarterly growth in usage</li>
                <li>Stable pricing from providers</li>
                <li>Annual projected cost: ${(costs.total * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="roi" className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Monthly Impact</h4>
                <ul className="space-y-2 text-sm">
                  <li>Hours Saved: {monthlyTimesSaved}</li>
                  <li>Cost Savings: ${monthlySavings.toLocaleString()}</li>
                  <li>AI Investment: ${costs.total.toFixed(2)}</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Annual Projection</h4>
                <ul className="space-y-2 text-sm">
                  <li>Hours Saved: {monthlyTimesSaved * 12}</li>
                  <li>Cost Savings: ${annualSavings.toLocaleString()}</li>
                  <li>ROI: {roi.toFixed(1)}%</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">ROI Calculation Basis:</p>
              <ul className="list-disc ml-4 text-sm text-muted-foreground">
                <li>Average medical writer rate: ${monthlyLaborCost}/hour</li>
                <li>Time saved per page: 2 hours</li>
                <li>Includes content creation and review cycles</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Traditional Approach (Monthly)</h4>
                <ul className="space-y-2 text-sm">
                  <li>Content Writers: ${monthlyTimesSaved * monthlyLaborCost}</li>
                  <li>Review Cycles: ${(monthlyTimesSaved * monthlyLaborCost * 0.3).toFixed(2)}</li>
                  <li>Tools & Software: $500</li>
                  <li><strong>Total: ${(monthlyTimesSaved * monthlyLaborCost * 1.3 + 500).toFixed(2)}</strong></li>
                </ul>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">AI-Assisted Approach (Monthly)</h4>
                <ul className="space-y-2 text-sm">
                  <li>AI Platform Cost: ${costs.total.toFixed(2)}</li>
                  <li>Reduced Review Time: ${(monthlyTimesSaved * monthlyLaborCost * 0.1).toFixed(2)}</li>
                  <li>Training & Setup: $200</li>
                  <li><strong>Total: ${(costs.total + monthlyTimesSaved * monthlyLaborCost * 0.1 + 200).toFixed(2)}</strong></li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                The AI-assisted approach shows a {Math.round(((monthlyTimesSaved * monthlyLaborCost * 1.3 + 500) - (costs.total + monthlyTimesSaved * monthlyLaborCost * 0.1 + 200)) / (monthlyTimesSaved * monthlyLaborCost * 1.3 + 500) * 100)}% cost reduction compared to traditional methods, while potentially improving consistency and reducing turnaround time.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}