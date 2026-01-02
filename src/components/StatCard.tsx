import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "stat-card animate-fade-in",
      variant === 'primary' && "bg-primary text-primary-foreground",
      variant === 'success' && "bg-accent border-primary/20",
      variant === 'warning' && "bg-warning/10 border-warning/20",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === 'primary' ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl font-semibold tracking-tight",
            variant === 'primary' && "text-primary-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === 'primary' ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg",
            variant === 'primary' 
              ? "bg-primary-foreground/10" 
              : variant === 'success'
              ? "bg-primary/10"
              : "bg-secondary"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              variant === 'primary' 
                ? "text-primary-foreground" 
                : variant === 'success'
                ? "text-primary"
                : "text-muted-foreground"
            )} />
          </div>
        )}
      </div>
    </div>
  );
}
