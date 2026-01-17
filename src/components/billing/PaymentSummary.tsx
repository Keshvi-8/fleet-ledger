import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface PaymentSummaryProps {
  netPayable: number;
  totalPaid: number;
  balance: number;
  className?: string;
}

export function PaymentSummary({
  netPayable,
  totalPaid,
  balance,
  className,
}: PaymentSummaryProps) {
  const percentPaid = netPayable > 0 ? Math.min(100, (totalPaid / netPayable) * 100) : 0;
  const isPaidInFull = balance <= 0;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Payment Progress</span>
        <span className="font-medium">{Math.round(percentPaid)}%</span>
      </div>
      
      <Progress value={percentPaid} className="h-2" />
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Total Bill</p>
          <p className="font-semibold">{formatCurrency(netPayable)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="font-semibold text-success">{formatCurrency(totalPaid)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Balance</p>
          <p
            className={cn(
              'font-semibold',
              isPaidInFull ? 'text-success' : 'text-destructive'
            )}
          >
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
