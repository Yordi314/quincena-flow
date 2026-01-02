import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoneyInput } from '@/components/MoneyInput';
import { CalendarIcon, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface IncomeCardProps {
  income: number;
  onIncomeChange: (income: number) => void;
  quincenaDate: Date | undefined;
  onQuincenaDateChange: (date: Date | undefined) => void;
}

export function IncomeCard({ 
  income, 
  onIncomeChange, 
  quincenaDate, 
  onQuincenaDateChange 
}: IncomeCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Ingreso Neto</h3>
            <p className="text-xs text-muted-foreground/70">Esta quincena</p>
          </div>
        </div>
        
        <MoneyInput
          value={income}
          onChange={onIncomeChange}
          inputSize="xl"
          placeholder="0"
          className="mb-4 bg-background/50"
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Fecha:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal flex-1",
                  !quincenaDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {quincenaDate ? (
                  format(quincenaDate, "d 'de' MMMM, yyyy", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={quincenaDate}
                onSelect={onQuincenaDateChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
