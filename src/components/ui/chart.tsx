import { cn } from "@/lib/utils";

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Chart({ className, ...props }: ChartProps) {
  return (
    <div className={cn("", className)} {...props} />
  );
}