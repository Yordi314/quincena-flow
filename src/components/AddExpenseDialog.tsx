import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MoneyInput } from '@/components/MoneyInput';
import { Plus } from 'lucide-react';
import type { FixedExpense, PayDay } from '@/types/finance';

interface AddExpenseDialogProps {
  onAdd: (expense: Omit<FixedExpense, 'id'>) => void;
}

export function AddExpenseDialog({ onAdd }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [payDay, setPayDay] = useState<PayDay>('15');
  const [isPeriodic, setIsPeriodic] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onAdd({
      name,
      amount,
      payDay,
      isPeriodic,
      dueDate: isPeriodic ? dueDate : undefined,
    });

    // Reset form
    setName('');
    setAmount(0);
    setPayDay('15');
    setIsPeriodic(false);
    setDueDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Gasto Fijo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="ej. Alquiler"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Monto</Label>
            <MoneyInput
              value={amount}
              onChange={setAmount}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Día de Pago</Label>
            <Select value={payDay} onValueChange={(v) => setPayDay(v as PayDay)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Día 15</SelectItem>
                <SelectItem value="30">Día 30</SelectItem>
                <SelectItem value="both">Ambas Quincenas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="periodic">Es gasto periódico (ej. cada 3 meses)</Label>
            <Switch
              id="periodic"
              checked={isPeriodic}
              onCheckedChange={setIsPeriodic}
            />
          </div>
          {isPeriodic && (
            <div className="space-y-2">
              <Label htmlFor="dueDate">Fecha Límite</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            Agregar Gasto Fijo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
