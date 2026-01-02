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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceStore } from '@/hooks/useFinanceStore';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Wallet, PiggyBank, TrendingUp, CreditCard } from 'lucide-react';

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
    distribution,
    remainingWants,
    totalSpent,
    totalSaved,
  } = useFinanceStore();

  const percentUsed = distribution.totalWants > 0 
    ? ((distribution.totalWants - remainingWants) / distribution.totalWants) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Quincenal</h1>
              <p className="text-sm text-muted-foreground">Gestión de Finanzas Personales</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="income" className="text-sm font-medium">Ingreso:</Label>
                <Input
                  id="income"
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(parseFloat(e.target.value) || 0)}
                  className="w-32 text-right font-semibold"
                />
              </div>
              <ConfigPanel config={config} onConfigChange={setConfig} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Stats & Quick Actions */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Ingreso Neto"
                value={formatCurrency(currentIncome)}
                subtitle="Esta quincena"
                icon={Wallet}
              />
              <StatCard
                title="Total Gastado"
                value={formatCurrency(totalSpent)}
                subtitle="Gastos variables"
                icon={CreditCard}
              />
              <StatCard
                title="Ahorro Acumulado"
                value={formatCurrency(totalSaved)}
                subtitle="Total en metas"
                icon={PiggyBank}
                variant="success"
              />
              <StatCard
                title="Disponible"
                value={formatCurrency(remainingWants)}
                subtitle={`${formatPercentage(100 - percentUsed)} restante`}
                icon={TrendingUp}
                variant="primary"
              />
            </div>

            {/* Budget Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribución del Presupuesto</CardTitle>
              </CardHeader>
              <CardContent>
                <BudgetDistributionChart 
                  distribution={distribution} 
                  income={currentIncome} 
                />
              </CardContent>
            </Card>

            {/* Quincena Tabs for Fixed Expenses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Gastos Fijos</CardTitle>
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

          {/* Right Column - Tracking & Savings */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Available Balance Ring */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <ProgressRing progress={100 - percentUsed} size={160} strokeWidth={12}>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{formatCurrency(remainingWants)}</p>
                      <p className="text-sm text-muted-foreground">disponible</p>
                    </div>
                  </ProgressRing>
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    Has usado {formatPercentage(percentUsed)} de tu presupuesto personal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registrar Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickExpenseForm onSubmit={addTransaction} />
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardContent className="pt-6">
                <RecentTransactions transactions={transactions} />
              </CardContent>
            </Card>

            {/* Savings Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metas de Ahorro</CardTitle>
              </CardHeader>
              <CardContent>
                <SavingsGoalsChart goals={savingsGoals} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
