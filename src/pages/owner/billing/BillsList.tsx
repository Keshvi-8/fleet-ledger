import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BillCard } from '@/components/billing/BillCard';
import { BillDetails } from '@/components/billing/BillDetails';
import { Bill } from '@/utils/billingUtils';
import { mockBills } from '@/utils/mockBills';
import { BILL_STATUS } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatters';
import { Search, FileText, Send, CheckCircle, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function BillsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bills.length,
    generated: bills.filter((b) => b.status === BILL_STATUS.GENERATED).length,
    sent: bills.filter((b) => b.status === BILL_STATUS.SENT).length,
    paid: bills.filter((b) => b.status === BILL_STATUS.PAID).length,
    pendingAmount: bills
      .filter((b) => b.status !== BILL_STATUS.PAID)
      .reduce((sum, b) => sum + b.netPayable, 0),
  };

  const handleSendBill = (bill: Bill) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === bill.id
          ? { ...b, status: BILL_STATUS.SENT, sentAt: new Date().toISOString() }
          : b
      )
    );
    toast({
      title: 'Bill Sent',
      description: `Bill ${bill.billNumber} sent to ${bill.clientName} via WhatsApp`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Bills</h1>
          <p className="text-muted-foreground">Manage and track client invoices</p>
        </div>
        <Button onClick={() => navigate('/owner/billing/generate')}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Bills
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Total Bills</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Generated</span>
          </div>
          <p className="text-2xl font-bold">{stats.generated}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Send className="h-4 w-4" />
            <span className="text-sm">Sent</span>
          </div>
          <p className="text-2xl font-bold">{stats.sent}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Paid</span>
          </div>
          <p className="text-2xl font-bold text-success">{stats.paid}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border col-span-2 md:col-span-1">
          <div className="text-muted-foreground text-sm mb-1">Pending Amount</div>
          <p className="text-2xl font-bold text-warning">{formatCurrency(stats.pendingAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client or bill number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={BILL_STATUS.GENERATED}>Generated</SelectItem>
            <SelectItem value={BILL_STATUS.SENT}>Sent</SelectItem>
            <SelectItem value={BILL_STATUS.PAID}>Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bills Grid */}
      {filteredBills.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No bills found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onView={setSelectedBill}
              onSend={handleSendBill}
            />
          ))}
        </div>
      )}

      {/* Bill Details Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedBill && <BillDetails bill={selectedBill} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
