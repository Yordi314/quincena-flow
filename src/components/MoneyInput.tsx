import { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size'> {
  value: number;
  onChange: (value: number) => void;
  showCurrency?: boolean;
  inputSize?: 'default' | 'lg' | 'xl';
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, showCurrency = true, inputSize = 'default', className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatNumber(value));

    useEffect(() => {
      setDisplayValue(formatNumber(value));
    }, [value]);

    function formatNumber(num: number): string {
      if (num === 0) return '';
      return num.toLocaleString('es-DO');
    }

    function parseNumber(str: string): number {
      const cleaned = str.replace(/[^\d]/g, '');
      return parseInt(cleaned) || 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numericValue = parseNumber(rawValue);
      setDisplayValue(formatNumber(numericValue));
      onChange(numericValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (value === 0) {
        setDisplayValue('');
      }
    };

    const handleBlur = () => {
      setDisplayValue(formatNumber(value));
    };

    const sizeClasses = {
      default: 'text-base',
      lg: 'text-lg',
      xl: 'text-2xl h-14',
    };

    return (
      <div className="relative">
        {showCurrency && (
          <span className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium",
            inputSize === 'xl' && 'text-lg'
          )}>
            RD$
          </span>
        )}
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            showCurrency && 'pl-12',
            sizeClasses[inputSize],
            'text-right font-semibold',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

MoneyInput.displayName = 'MoneyInput';
