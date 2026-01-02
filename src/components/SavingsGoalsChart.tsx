import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import type { SavingsGoal } from '@/types/finance';

interface SavingsGoalsChartProps {
  goals: SavingsGoal[];
  className?: string;
}

export function SavingsGoalsChart({ goals, className }: SavingsGoalsChartProps) {
  const total = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Simple donut-like visualization
  let accumulatedPercentage = 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Donut Chart */}
      <div className="relative flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
          {goals.map((goal, index) => {
            const percentage = goal.percentage;
            const dashArray = (percentage / 100) * 283; // 2 * PI * 45 (radius)
            const dashOffset = (accumulatedPercentage / 100) * 283;
            accumulatedPercentage += percentage;

            return (
              <circle
                key={goal.id}
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke={goal.color}
                strokeWidth="20"
                strokeDasharray={`${dashArray} 283`}
                strokeDashoffset={-dashOffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{formatCurrency(total)}</span>
          <span className="text-sm text-muted-foreground">Ahorro Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: goal.color }}
              />
              <div>
                <p className="font-medium text-sm">{goal.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(goal.percentage)} del ahorro
                </p>
              </div>
            </div>
            <span className="font-semibold">{formatCurrency(goal.currentAmount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
