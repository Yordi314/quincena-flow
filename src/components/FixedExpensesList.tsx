import { cn } from '@/lib/utils';
import { formatCurrency, getQuincenasRemaining } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Clock } from 'lucide-react';
import type { FixedExpense } from '@/types/finance';

interface FixedExpensesListProps {
  expenses: FixedExpense[];
  quincena: '15' | '30';
  onDelete: (id: string) => void;
  className?: string;
}

export function FixedExpensesList({ 
  expenses, 
  quincena,
  onDelete,
  className 
}: FixedExpensesListProps) {
  const filteredExpenses = expenses.filter(
    e => e.payDay === quincena || e.payDay === 'both'
  );

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Gastos Fijos - Día {quincena}
        </h3>
        <Badge variant="secondary">{formatCurrency(total)}</Badge>
      </div>

      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay gastos fijos para esta quincena
          </p>
        ) : (
          filteredExpenses.map((expense) => {
            const quincenasLeft = expense.dueDate 
              ? getQuincenasRemaining(expense.dueDate) 
              : null;

            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group hover:bg-secondary transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{expense.name}</span>
                    {expense.isPeriodic && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        Periódico
                      </Badge>
                    )}
                  </div>
                  {expense.isPeriodic && expense.dueDate && quincenasLeft !== null && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{quincenasLeft} quincenas restantes</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
