import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface AgingSummaryCardProps {
  label: string;
  amount: number;
  count: number;
  colorClass: string;
  bgClass: string;
}

export const AgingSummaryCard = ({
  label,
  amount,
  count,
  colorClass,
  bgClass,
}: AgingSummaryCardProps) => {
  return (
    <Card className={cn('border-l-4', bgClass)}>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn('text-xl font-bold mt-1', colorClass)}>
          {formatCurrency(amount)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {count} {count === 1 ? 'bill' : 'bills'}
        </p>
      </CardContent>
    </Card>
  );
};
