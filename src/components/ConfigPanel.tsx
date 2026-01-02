import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import type { Config, OverflowDestination } from '@/types/finance';

interface ConfigPanelProps {
  config: Config;
  onConfigChange: (config: Config) => void;
}

export function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configuración de Reglas</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Savings Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Configuración de Ahorro
            </h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="usePct">Usar porcentaje (en vez de monto fijo)</Label>
              <Switch
                id="usePct"
                checked={config.useSavingsPercentage}
                onCheckedChange={(checked) => 
                  onConfigChange({ ...config, useSavingsPercentage: checked })
                }
              />
            </div>

            {config.useSavingsPercentage ? (
              <div className="space-y-2">
                <Label htmlFor="savingsPct">Porcentaje de Ahorro</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="savingsPct"
                    type="number"
                    min="1"
                    max="50"
                    value={config.savingsPercentage}
                    onChange={(e) => 
                      onConfigChange({ ...config, savingsPercentage: parseInt(e.target.value) || 20 })
                    }
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="fixedSavings">Monto Fijo de Ahorro (RD$)</Label>
                <Input
                  id="fixedSavings"
                  type="number"
                  value={config.fixedSavingsAmount}
                  onChange={(e) => 
                    onConfigChange({ ...config, fixedSavingsAmount: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            )}
          </div>

          {/* Overflow Rules */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Reglas de Excedente
            </h3>
            
            <div className="space-y-2">
              <Label>Excedente del 50% (Necesidades) va a:</Label>
              <Select 
                value={config.overflowFrom50} 
                onValueChange={(v) => 
                  onConfigChange({ ...config, overflowFrom50: v as OverflowDestination })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Gastos Personales (30%)</SelectItem>
                  <SelectItem value="savings">Ahorro (20%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Cuando tus gastos fijos son menores al 50%, el sobrante se moverá automáticamente.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Excedente del 20% (Ahorro) va a:</Label>
              <Select 
                value={config.overflowFrom20} 
                onValueChange={(v) => 
                  onConfigChange({ ...config, overflowFrom20: v as OverflowDestination })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Gastos Personales (30%)</SelectItem>
                  <SelectItem value="savings">Ahorro (20%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Cuando usas un monto fijo de ahorro menor al 20%, el sobrante se moverá automáticamente.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
