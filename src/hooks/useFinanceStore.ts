import { useState, useEffect } from 'react';
import type { Config, FixedExpense, SavingsGoal, Transaction, BudgetDistribution } from '@/types/finance';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SavingsHistory {
  date: string;
  amount: number;
  label: string;
}

const defaultConfig: Config = {
  fixedSavingsAmount: 3000,
  useSavingsPercentage: false,
  savingsPercentage: 20,
  overflowFrom50: 'personal',
  overflowFrom20: 'personal',
};

const defaultGoals: SavingsGoal[] = [
  { id: '1', name: 'Fondo de Emergencia', percentage: 50, currentAmount: 15000, color: 'hsl(160, 84%, 39%)' },
  { id: '2', name: 'Viaje', percentage: 30, currentAmount: 8500, color: 'hsl(200, 84%, 45%)' },
  { id: '3', name: 'Inversión', percentage: 20, currentAmount: 4200, color: 'hsl(270, 60%, 55%)' },
];

const defaultExpenses: FixedExpense[] = [
  { id: '1', name: 'Alquiler', amount: 12000, payDay: '15', isPeriodic: false },
  { id: '2', name: 'Internet', amount: 1500, payDay: '30', isPeriodic: false },
  { id: '3', name: 'Electricidad', amount: 2500, payDay: '30', isPeriodic: false },
  { id: '4', name: 'Seguro Auto', amount: 8000, payDay: '15', isPeriodic: true, dueDate: '2025-03-15' },
];

const defaultTransactions: Transaction[] = [
  { id: '1', date: '2025-01-02', amount: 850, type: 'variable', category: 'Comida', note: 'Almuerzo con amigos' },
  { id: '2', date: '2025-01-01', amount: 2500, type: 'variable', category: 'Entretenimiento', note: 'Netflix y Spotify' },
];

const defaultSavingsHistory: SavingsHistory[] = [
  { date: '2024-10-15', amount: 18000, label: 'Oct 15' },
  { date: '2024-10-30', amount: 21000, label: 'Oct 30' },
  { date: '2024-11-15', amount: 23500, label: 'Nov 15' },
  { date: '2024-11-30', amount: 25200, label: 'Nov 30' },
  { date: '2024-12-15', amount: 26800, label: 'Dic 15' },
  { date: '2024-12-30', amount: 27700, label: 'Dic 30' },
];

const STORAGE_KEY = 'quincenal-finance-data';

const emptyState = {
  config: defaultConfig,
  fixedExpenses: [] as FixedExpense[],
  savingsGoals: [] as SavingsGoal[],
  transactions: [] as Transaction[],
  currentIncome: 0,
  currentQuincena: '15' as '15' | '30',
  quincenaDate: undefined as Date | undefined,
  savingsHistory: [] as SavingsHistory[],
};

export function useFinanceStore() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(defaultExpenses);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(defaultGoals);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [currentIncome, setCurrentIncome] = useState<number>(35000);
  const [currentQuincena, setCurrentQuincena] = useState<'15' | '30'>('15');
  const [quincenaDate, setQuincenaDate] = useState<Date | undefined>(new Date());
  const [savingsHistory, setSavingsHistory] = useState<SavingsHistory[]>(defaultSavingsHistory);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.config) setConfig(data.config);
        if (data.fixedExpenses) setFixedExpenses(data.fixedExpenses);
        if (data.savingsGoals) setSavingsGoals(data.savingsGoals);
        if (data.transactions) setTransactions(data.transactions);
        if (data.currentIncome !== undefined) setCurrentIncome(data.currentIncome);
        if (data.currentQuincena) setCurrentQuincena(data.currentQuincena);
        if (data.quincenaDate) setQuincenaDate(new Date(data.quincenaDate));
        if (data.savingsHistory) setSavingsHistory(data.savingsHistory);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    const data = { 
      config, 
      fixedExpenses, 
      savingsGoals, 
      transactions, 
      currentIncome, 
      currentQuincena,
      quincenaDate: quincenaDate?.toISOString(),
      savingsHistory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [config, fixedExpenses, savingsGoals, transactions, currentIncome, currentQuincena, quincenaDate, savingsHistory]);

  // Calculate budget distribution based on cascade logic
  const calculateDistribution = (income: number, quincena: '15' | '30'): BudgetDistribution => {
    const relevantExpenses = fixedExpenses.filter(
      e => e.payDay === quincena || e.payDay === 'both'
    );
    const totalFixed = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // 50% for needs
    const needsBudget = income * 0.5;
    const needsOverflow = Math.max(0, needsBudget - totalFixed);
    
    // 20% for savings (or fixed amount)
    const savingsBudget = config.useSavingsPercentage 
      ? income * (config.savingsPercentage / 100)
      : Math.min(config.fixedSavingsAmount, income * 0.2);
    const savingsOverflow = Math.max(0, income * 0.2 - savingsBudget);
    
    // 30% for wants + overflows
    const basWants = income * 0.3;
    let totalWants = basWants;
    
    if (config.overflowFrom50 === 'personal') totalWants += needsOverflow;
    if (config.overflowFrom20 === 'personal') totalWants += savingsOverflow;
    
    const actualSavings = config.overflowFrom50 === 'savings' 
      ? savingsBudget + needsOverflow 
      : savingsBudget;
    
    return {
      needs: totalFixed,
      savings: actualSavings + (config.overflowFrom20 === 'savings' ? savingsOverflow : 0),
      wants: basWants,
      needsOverflow,
      savingsOverflow,
      totalWants,
    };
  };

  const distribution = calculateDistribution(currentIncome, currentQuincena);
  
  // Calculate spent from variable transactions
  const currentMonthTransactions = transactions.filter(t => {
    const transDate = new Date(t.date);
    const now = new Date();
    return transDate.getMonth() === now.getMonth() && 
           transDate.getFullYear() === now.getFullYear() &&
           t.type === 'variable';
  });
  
  const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remainingWants = distribution.totalWants - totalSpent;

  // CRUD operations
  const addExpense = (expense: Omit<FixedExpense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setFixedExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<FixedExpense>) => {
    setFixedExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpense = (id: string) => {
    setFixedExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const clearAllData = () => {
    setConfig(defaultConfig);
    setFixedExpenses([]);
    setSavingsGoals([]);
    setTransactions([]);
    setCurrentIncome(0);
    setCurrentQuincena('15');
    setQuincenaDate(undefined);
    setSavingsHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  return {
    config,
    setConfig,
    fixedExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    savingsGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    transactions,
    addTransaction,
    currentIncome,
    setCurrentIncome,
    currentQuincena,
    setCurrentQuincena,
    quincenaDate,
    setQuincenaDate,
    savingsHistory,
    distribution,
    remainingWants,
    totalSpent,
    totalSaved,
    clearAllData,
  };
}
