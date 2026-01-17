import { useState } from 'react';
import { Bill } from '@/utils/billingUtils';
import { BillStatusBadge } from './BillStatusBadge';
import { PaymentForm } from './PaymentForm';
import { PaymentHistory } from './PaymentHistory';
import { PaymentSummary } from './PaymentSummary';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building2, MapPin, Phone, FileText, Calendar, Plus, CreditCard } from 'lucide-react';
import { Payment, calculatePaymentSummary } from '@/utils/paymentUtils';
import { BILL_STATUS } from '@/utils/constants';

interface BillDetailsProps {
  bill: Bill;
  onPaymentAdded?: (billId: string, payment: Payment) => void;
}

export function BillDetails({ bill, onPaymentAdded }: BillDetailsProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const { totalPaid, balance, isPaidInFull } = calculatePaymentSummary(
    bill.netPayable,
    bill.payments || []
  );

  const handlePaymentSubmit = (payment: Payment) => {
    onPaymentAdded?.(bill.id, payment);
    setIsPaymentDialogOpen(false);
  };

  const showPaymentButton = bill.status !== BILL_STATUS.PAID && balance > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">{bill.billNumber}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Period: {bill.billingPeriod.label}</span>
          </div>
        </div>
        <BillStatusBadge status={bill.status} />
      </div>

      <Separator />

      {/* Payment Summary */}
      {bill.payments && bill.payments.length > 0 && (
        <>
          <PaymentSummary
            netPayable={bill.netPayable}
            totalPaid={totalPaid}
            balance={balance}
          />
          <Separator />
        </>
      )}

      {/* Client Info */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Bill To
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">{bill.clientName}</p>
            <p className="text-muted-foreground">GST: {bill.clientGst}</p>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {bill.clientAddress}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {bill.clientWhatsapp}
            </p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <h3 className="font-semibold mb-3">Journey Details</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Route</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Rate/Ton</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Advance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bill.lineItems.map((item) => (
                <TableRow key={item.journeyId}>
                  <TableCell className="text-sm">{formatDate(item.date)}</TableCell>
                  <TableCell className="font-mono text-sm">{item.truckNumber}</TableCell>
                  <TableCell className="text-sm">
                    {item.fromLocation} → {item.toLocation}
                  </TableCell>
                  <TableCell className="text-right">{item.weight} T</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.ratePerTon)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.freightAmount)}
                  </TableCell>
                  <TableCell className="text-right text-warning">
                    {formatCurrency(item.clientAdvance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* GST Breakdown */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">GST Breakdown</h4>
            <div className="space-y-1 text-sm">
              {bill.cgst > 0 && (
                <div className="flex justify-between">
                  <span>CGST (9%)</span>
                  <span>{formatCurrency(bill.cgst)}</span>
                </div>
              )}
              {bill.sgst > 0 && (
                <div className="flex justify-between">
                  <span>SGST (9%)</span>
                  <span>{formatCurrency(bill.sgst)}</span>
                </div>
              )}
              {bill.igst > 0 && (
                <div className="flex justify-between">
                  <span>IGST (18%)</span>
                  <span>{formatCurrency(bill.igst)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total GST</span>
              <span>{formatCurrency(bill.totalGst)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Grand Total</span>
              <span>{formatCurrency(bill.grandTotal)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-warning">
              <span>Less: Advance Paid</span>
              <span>- {formatCurrency(bill.totalAdvance)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-2">
              <span>Net Payable</span>
              <span>{formatCurrency(bill.netPayable)}</span>
            </div>
            {totalPaid > 0 && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between text-success">
                  <span>Payments Received</span>
                  <span>- {formatCurrency(totalPaid)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Balance Due</span>
                  <span className={balance > 0 ? 'text-destructive' : 'text-success'}>
                    {formatCurrency(balance)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      {bill.payments && bill.payments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment History
            </h3>
          </div>
          <PaymentHistory payments={bill.payments} />
        </div>
      )}

      {/* Record Payment Button */}
      {showPaymentButton && (
        <Button onClick={() => setIsPaymentDialogOpen(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      )}

      {/* Timeline */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Generated: {formatDate(bill.generatedAt)}</p>
        {bill.sentAt && <p>Sent: {formatDate(bill.sentAt)}</p>}
        {bill.paidAt && <p>Fully Paid: {formatDate(bill.paidAt)}</p>}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <PaymentForm
            billId={bill.id}
            maxAmount={balance}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setIsPaymentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
