import { Bill } from '@/utils/billingUtils';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, FileText, Package } from 'lucide-react';

interface GenerateBillsPreviewProps {
  bills: Bill[];
  selectedBills: Set<string>;
  onToggleBill: (billId: string) => void;
  onToggleAll: () => void;
}

export function GenerateBillsPreview({
  bills,
  selectedBills,
  onToggleBill,
  onToggleAll,
}: GenerateBillsPreviewProps) {
  const allSelected = bills.length > 0 && selectedBills.size === bills.length;

  if (bills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No billable journeys found for this period</p>
        <p className="text-sm mt-1">Only completed/locked trips are included in billing</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Select All */}
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={onToggleAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
          Select All ({bills.length} bills)
        </label>
        <span className="ml-auto text-sm text-muted-foreground">
          Total: {formatCurrency(bills.reduce((sum, b) => sum + b.netPayable, 0))}
        </span>
      </div>

      {/* Bill Cards */}
      <div className="grid gap-3">
        {bills.map((bill) => (
          <Card
            key={bill.id}
            className={`cursor-pointer transition-all ${
              selectedBills.has(bill.id)
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/30'
            }`}
            onClick={() => onToggleBill(bill.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedBills.has(bill.id)}
                  onCheckedChange={() => onToggleBill(bill.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium truncate">{bill.clientName}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Journeys</p>
                      <p className="font-medium">{bill.lineItems.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Subtotal</p>
                      <p className="font-medium">{formatCurrency(bill.subtotal)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">GST</p>
                      <p className="font-medium">{formatCurrency(bill.totalGst)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Net Payable</p>
                      <p className="font-semibold text-primary">{formatCurrency(bill.netPayable)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {selectedBills.size > 0 && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedBills.size} bill(s) selected</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(
                  bills
                    .filter((b) => selectedBills.has(b.id))
                    .reduce((sum, b) => sum + b.netPayable, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
