import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bill } from '@/utils/billingUtils';
import { BillStatusBadge } from './BillStatusBadge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Building2, Calendar, FileText, Send, Eye } from 'lucide-react';
import { BILL_STATUS } from '@/utils/constants';

interface BillCardProps {
  bill: Bill;
  onView: (bill: Bill) => void;
  onSend: (bill: Bill) => void;
}

export function BillCard({ bill, onView, onSend }: BillCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">{bill.billNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-sm">{bill.clientName}</span>
            </div>
          </div>
          <BillStatusBadge status={bill.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{bill.billingPeriod.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Subtotal</p>
            <p className="font-medium">{formatCurrency(bill.subtotal)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">GST (18%)</p>
            <p className="font-medium">{formatCurrency(bill.totalGst)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Advance Paid</p>
            <p className="font-medium text-warning">{formatCurrency(bill.totalAdvance)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Net Payable</p>
            <p className="font-semibold text-primary">{formatCurrency(bill.netPayable)}</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <span>{bill.lineItems.length} journey{bill.lineItems.length !== 1 ? 's' : ''}</span>
          <span className="mx-2">•</span>
          <span>Generated {formatDate(bill.generatedAt)}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(bill)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {bill.status === BILL_STATUS.GENERATED && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onSend(bill)}
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
