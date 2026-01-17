import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Payment,
  paymentModeLabels,
  paymentModeIcons,
} from '@/utils/paymentUtils';
import { cn } from '@/lib/utils';

interface PaymentHistoryProps {
  payments: Payment[];
  className?: string;
}

export function PaymentHistory({ payments, className }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className={cn('text-center py-6 text-muted-foreground', className)}>
        <p>No payments recorded yet</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {payments
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((payment) => (
          <Card key={payment.id} className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{paymentModeIcons[payment.mode]}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-success">
                        {formatCurrency(payment.amount)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {paymentModeLabels[payment.mode]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(payment.date)}
                    </p>
                    {payment.reference && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Ref: {payment.reference}
                      </p>
                    )}
                    {payment.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
