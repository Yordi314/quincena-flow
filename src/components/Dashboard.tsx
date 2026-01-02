import { useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { ProgressRing } from '@/components/ProgressRing';
import { BudgetDistributionChart } from '@/components/BudgetDistributionChart';
import { QuickExpenseForm } from '@/components/QuickExpenseForm';
import { FixedExpensesList } from '@/components/FixedExpensesList';
import { SavingsGoalsChart } from '@/components/SavingsGoalsChart';
import { RecentTransactions } from '@/components/RecentTransactions';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { ConfigPanel } from '@/components/ConfigPanel';
import { IncomeCard } from '@/components/IncomeCard';
import { SavingsLineChart } from '@/components/SavingsLineChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Wallet, PiggyBank, TrendingUp, CreditCard, Trash2, Settings } from 'lucide-react';

export function Dashboard() {
  const {
    config,
    setConfig,
    fixedExpenses,
    addExpense,
    deleteExpense,
    savingsGoals,
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
  } = useFinanceStore();

  const percentUsed = distribution.totalWants > 0 
    ? ((distribution.totalWants - remainingWants) / distribution.totalWants) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Quincenal</h1>
              <p className="text-sm text-muted-foreground">Gestión de Finanzas Personales</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Borrar todos los datos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará permanentemente todos los gastos, transacciones, metas de ahorro y configuraciones. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllData} className="bg-destructive hover:bg-destructive/90">
                      Borrar Todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ConfigPanel config={config} onConfigChange={setConfig} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Bento Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-12 gap-4 auto-rows-min">
          
          {/* Row 1 */}
          {/* Income Card - Large */}
          <div className="col-span-12 lg:col-span-4 row-span-1">
            <IncomeCard 
              income={currentIncome}
              onIncomeChange={setCurrentIncome}
              quincenaDate={quincenaDate}
              onQuincenaDateChange={setQuincenaDate}
            />
          </div>

          {/* KPI Cards */}
          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
            <StatCard
              title="Gastado"
              value={formatCurrency(totalSpent)}
              subtitle="Variables"
              icon={CreditCard}
              className="h-full"
            />
          </div>
          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
            <StatCard
              title="Ahorrado"
              value={formatCurrency(totalSaved)}
              subtitle="En metas"
              icon={PiggyBank}
              variant="success"
              className="h-full"
            />
          </div>
          
          {/* Available Balance Ring */}
          <div className="col-span-12 lg:col-span-4 row-span-2">
            <Card className="h-full">
              <CardContent className="pt-6 h-full flex flex-col items-center justify-center">
                <ProgressRing progress={100 - percentUsed} size={180} strokeWidth={14}>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{formatCurrency(remainingWants)}</p>
                    <p className="text-sm text-muted-foreground">disponible</p>
                  </div>
                </ProgressRing>
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Has usado {formatPercentage(percentUsed)} de tu presupuesto personal
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 */}
          {/* Budget Distribution */}
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Distribución 50/30/20</CardTitle>
              </CardHeader>
              <CardContent>
                <BudgetDistributionChart 
                  distribution={distribution} 
                  income={currentIncome} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Row 3 */}
          {/* Fixed Expenses */}
          <div className="col-span-12 lg:col-span-5">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Gastos Fijos</CardTitle>
                <AddExpenseDialog onAdd={addExpense} />
              </CardHeader>
              <CardContent>
                <Tabs 
                  value={currentQuincena} 
                  onValueChange={(v) => setCurrentQuincena(v as '15' | '30')}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="15">Quincena 15</TabsTrigger>
                    <TabsTrigger value="30">Quincena 30</TabsTrigger>
                  </TabsList>
                  <TabsContent value="15">
                    <FixedExpensesList 
                      expenses={fixedExpenses} 
                      quincena="15" 
                      onDelete={deleteExpense}
                    />
                  </TabsContent>
                  <TabsContent value="30">
                    <FixedExpensesList 
                      expenses={fixedExpenses} 
                      quincena="30" 
                      onDelete={deleteExpense}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Expense + Recent Transactions */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Registrar Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickExpenseForm onSubmit={addTransaction} />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Card className="h-full">
              <CardContent className="pt-6">
                <RecentTransactions transactions={transactions} />
              </CardContent>
            </Card>
          </div>

          {/* Row 4 */}
          {/* Savings Goals */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-5">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Metas de Ahorro</CardTitle>
              </CardHeader>
              <CardContent>
                <SavingsGoalsChart goals={savingsGoals} />
              </CardContent>
            </Card>
          </div>

          {/* Savings Line Chart */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-7">
            <SavingsLineChart history={savingsHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}
