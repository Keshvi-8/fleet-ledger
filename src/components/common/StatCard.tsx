import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  className?: string;
}

const variantStyles = {
  default: {
    icon: 'bg-secondary text-secondary-foreground',
    card: '',
  },
  primary: {
    icon: 'gradient-primary text-primary-foreground',
    card: '',
  },
  success: {
    icon: 'gradient-success text-success-foreground',
    card: '',
  },
  warning: {
    icon: 'gradient-warning text-warning-foreground',
    card: '',
  },
  accent: {
    icon: 'gradient-accent text-accent-foreground',
    card: '',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover',
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
            styles.icon
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
