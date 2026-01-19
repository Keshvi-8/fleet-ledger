import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  Payment,
  paymentModeLabels,
  paymentModeIcons,
} from '@/utils/paymentUtils';
import { Bill } from '@/utils/billingUtils';
import { generatePaymentReceipt } from '@/utils/receiptPdfUtils';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
  bill: Bill;
  className?: string;
}

export function PaymentHistory({ payments, bill, className }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className={cn('text-center py-6 text-muted-foreground', className)}>
        <p>No payments recorded yet</p>
      </div>
    );
  }

  const handleDownloadReceipt = (payment: Payment) => {
    generatePaymentReceipt(payment, bill, payments);
  };

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReceipt(payment)}
                  className="shrink-0"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
