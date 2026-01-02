import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoneyInput } from '@/components/MoneyInput';
import { Plus } from 'lucide-react';
import type { Transaction } from '@/types/finance';

const categories = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Compras',
  'Salud',
  'Otros'
];

interface QuickExpenseFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function QuickExpenseForm({ onSubmit }: QuickExpenseFormProps) {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      date: new Date().toISOString().split('T')[0],
      amount,
      type: 'variable',
      category,
      note: note || undefined,
    });

    setAmount(0);
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="amount">Monto</Label>
        <MoneyInput
          value={amount}
          onChange={setAmount}
          placeholder="0"
          inputSize="lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Nota (opcional)</Label>
        <Input
          id="note"
          placeholder="Descripción..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={!amount || !category}>
        <Plus className="mr-2 h-4 w-4" />
        Registrar
      </Button>
    </form>
  );
}
