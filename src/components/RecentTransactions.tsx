import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Transaction } from '@/types/finance';
import { ShoppingBag, Utensils, Car, Film, Heart, MoreHorizontal } from 'lucide-react';

const categoryIcons: Record<string, typeof ShoppingBag> = {
  'Comida': Utensils,
  'Transporte': Car,
  'Entretenimiento': Film,
  'Compras': ShoppingBag,
  'Salud': Heart,
  'Otros': MoreHorizontal,
};

interface RecentTransactionsProps {
  transactions: Transaction[];
  className?: string;
}

export function RecentTransactions({ transactions, className }: RecentTransactionsProps) {
  const recentTransactions = transactions
    .filter(t => t.type === 'variable')
    .slice(0, 5);

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Gastos Recientes
      </h3>

      <div className="space-y-2">
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay gastos registrados
          </p>
        ) : (
          recentTransactions.map((transaction) => {
            const Icon = categoryIcons[transaction.category] || MoreHorizontal;
            
            return (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-secondary">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.category}</p>
                  {transaction.note && (
                    <p className="text-sm text-muted-foreground truncate">{transaction.note}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-money-negative">
                    -{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
