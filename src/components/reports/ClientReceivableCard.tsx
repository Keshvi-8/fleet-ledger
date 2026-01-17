import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronUp, Phone, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ClientReceivable, calculateBillAge, getAgingColorClass, getAgingBgClass } from '@/utils/receivablesUtils';
import { BillStatusBadge } from '@/components/billing/BillStatusBadge';
import { cn } from '@/lib/utils';

interface ClientReceivableCardProps {
  receivable: ClientReceivable;
}

export const ClientReceivableCard = ({ receivable }: ClientReceivableCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasOverdue = receivable.aging.days61to90 > 0 || receivable.aging.over90 > 0;

  return (
    <Card className={cn(hasOverdue && 'border-destructive/50')}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-start justify-between cursor-pointer hover:bg-muted/50 -mx-4 -mt-4 p-4 rounded-t-lg transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{receivable.clientName}</h3>
                  {hasOverdue && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>{receivable.billCount} outstanding {receivable.billCount === 1 ? 'bill' : 'bills'}</span>
                  <span>•</span>
                  <span>Oldest: {receivable.oldestBillDays} days</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(receivable.totalOutstanding)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Outstanding</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Aging Summary */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: '0-30', key: 'current' as const },
              { label: '31-60', key: 'days31to60' as const },
              { label: '61-90', key: 'days61to90' as const },
              { label: '90+', key: 'over90' as const },
            ].map(({ label, key }) => (
              <div
                key={key}
                className={cn(
                  'rounded-lg p-2 text-center',
                  getAgingBgClass(key)
                )}
              >
                <p className="text-xs text-muted-foreground">{label} days</p>
                <p className={cn('font-semibold text-sm', getAgingColorClass(key))}>
                  {formatCurrency(receivable.aging[key])}
                </p>
              </div>
            ))}
          </div>

          <CollapsibleContent>
            {/* Bill Details Table */}
            <div className="border rounded-lg overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Bill No.</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivable.bills.map((bill) => {
                    const age = calculateBillAge(bill);
                    return (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">
                          {bill.billNumber}
                        </TableCell>
                        <TableCell>{bill.billingPeriod.label}</TableCell>
                        <TableCell>{formatDate(bill.generatedAt)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              age > 90
                                ? 'border-destructive text-destructive'
                                : age > 60
                                ? 'border-orange-500 text-orange-500'
                                : age > 30
                                ? 'border-warning text-warning'
                                : 'border-success text-success'
                            )}
                          >
                            {age} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <BillStatusBadge status={bill.status} />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(bill.netPayable)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`https://wa.me/${receivable.clientWhatsapp}`, '_blank')
                }
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Client
              </Button>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};
