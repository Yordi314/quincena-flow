import { useState, useEffect } from 'react';
import type { Config, FixedExpense, SavingsGoal, Transaction, QuincenaData, BudgetDistribution } from '@/types/finance';

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

const STORAGE_KEY = 'quincenal-finance-data';

export function useFinanceStore() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(defaultExpenses);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(defaultGoals);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [currentIncome, setCurrentIncome] = useState<number>(35000);
  const [currentQuincena, setCurrentQuincena] = useState<'15' | '30'>('15');

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
        if (data.currentIncome) setCurrentIncome(data.currentIncome);
        if (data.currentQuincena) setCurrentQuincena(data.currentQuincena);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    const data = { config, fixedExpenses, savingsGoals, transactions, currentIncome, currentQuincena };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [config, fixedExpenses, savingsGoals, transactions, currentIncome, currentQuincena]);

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
    distribution,
    remainingWants,
    totalSpent,
    totalSaved,
  };
}
