import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import type { BudgetDistribution } from '@/types/finance';

interface BudgetDistributionChartProps {
  distribution: BudgetDistribution;
  income: number;
  className?: string;
}

export function BudgetDistributionChart({ 
  distribution, 
  income,
  className 
}: BudgetDistributionChartProps) {
  const categories = [
    { 
      name: 'Necesidades', 
      amount: distribution.needs, 
      percentage: (distribution.needs / income) * 100,
      color: 'bg-zinc-600',
      overflow: distribution.needsOverflow > 0 ? `+${formatCurrency(distribution.needsOverflow)} excedente` : null
    },
    { 
      name: 'Ahorro', 
      amount: distribution.savings, 
      percentage: (distribution.savings / income) * 100,
      color: 'bg-primary',
      overflow: null
    },
    { 
      name: 'Gastos Personales', 
      amount: distribution.totalWants, 
      percentage: (distribution.totalWants / income) * 100,
      color: 'bg-blue-500',
      overflow: distribution.needsOverflow + distribution.savingsOverflow > 0 
        ? `Incluye ${formatCurrency(distribution.needsOverflow + distribution.savingsOverflow)} excedente` 
        : null
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stacked bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-secondary">
        {categories.map((cat, i) => (
          <div
            key={cat.name}
            className={cn(cat.color, "transition-all duration-500")}
            style={{ width: `${cat.percentage}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", cat.color)} />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(cat.amount)}</p>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(cat.percentage)} del ingreso
            </p>
            {cat.overflow && (
              <p className="text-xs text-primary">{cat.overflow}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
