export type PayDay = '15' | '30' | 'both';
export type OverflowDestination = 'savings' | 'personal';

export interface Config {
  fixedSavingsAmount: number;
  useSavingsPercentage: boolean;
  savingsPercentage: number;
  overflowFrom50: OverflowDestination;
  overflowFrom20: OverflowDestination;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  payDay: PayDay;
  isPeriodic: boolean;
  dueDate?: string;
  category?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  percentage: number;
  currentAmount: number;
  targetAmount?: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'fixed' | 'variable' | 'savings';
  category: string;
  note?: string;
}

export interface BudgetDistribution {
  needs: number;
  savings: number;
  wants: number;
  needsOverflow: number;
  savingsOverflow: number;
  totalWants: number;
}

export interface QuincenaData {
  income: number;
  distribution: BudgetDistribution;
  fixedExpenses: FixedExpense[];
  transactions: Transaction[];
  remainingWants: number;
}
