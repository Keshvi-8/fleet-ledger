import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, TrendingUp, Users, AlertCircle, Calendar } from 'lucide-react';
import { mockBills } from '@/utils/mockBills';
import { formatCurrency } from '@/utils/formatters';
import {
  calculateAgingBuckets,
  calculateClientReceivables,
  ClientReceivable,
} from '@/utils/receivablesUtils';
import { AgingSummaryCard } from '@/components/reports/AgingSummaryCard';
import { ClientReceivableCard } from '@/components/reports/ClientReceivableCard';
import { BILL_STATUS } from '@/utils/constants';

type SortOption = 'amount-desc' | 'amount-asc' | 'age-desc' | 'age-asc' | 'name-asc';

const ReceivablesReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('amount-desc');

  const agingBuckets = useMemo(() => calculateAgingBuckets(mockBills), []);
  const clientReceivables = useMemo(() => calculateClientReceivables(mockBills), []);

  const totalOutstanding = useMemo(
    () => mockBills
      .filter((b) => b.status !== BILL_STATUS.PAID)
      .reduce((sum, b) => sum + b.netPayable, 0),
    []
  );

  const totalBillsCount = useMemo(
    () => mockBills.filter((b) => b.status !== BILL_STATUS.PAID).length,
    []
  );

  const overdueAmount = useMemo(
    () => agingBuckets
      .filter((b) => b.min > 30)
      .reduce((sum, b) => sum + b.amount, 0),
    [agingBuckets]
  );

  const filteredReceivables = useMemo(() => {
    let result = [...clientReceivables];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.clientName.toLowerCase().includes(query) ||
        r.bills.some((b) => b.billNumber.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'amount-desc':
        result.sort((a, b) => b.totalOutstanding - a.totalOutstanding);
        break;
      case 'amount-asc':
        result.sort((a, b) => a.totalOutstanding - b.totalOutstanding);
        break;
      case 'age-desc':
        result.sort((a, b) => b.oldestBillDays - a.oldestBillDays);
        break;
      case 'age-asc':
        result.sort((a, b) => a.oldestBillDays - b.oldestBillDays);
        break;
      case 'name-asc':
        result.sort((a, b) => a.clientName.localeCompare(b.clientName));
        break;
    }

    return result;
  }, [clientReceivables, searchQuery, sortBy]);

  const agingColors = [
    { colorClass: 'text-success', bgClass: 'bg-success/10 border-l-success' },
    { colorClass: 'text-warning', bgClass: 'bg-warning/10 border-l-warning' },
    { colorClass: 'text-orange-500', bgClass: 'bg-orange-500/10 border-l-orange-500' },
    { colorClass: 'text-destructive', bgClass: 'bg-destructive/10 border-l-destructive' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Outstanding Receivables</h1>
          <p className="text-muted-foreground">
            Aging analysis of unpaid bills
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Bills</p>
                <p className="text-2xl font-bold">{totalBillsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients with Dues</p>
                <p className="text-2xl font-bold">{clientReceivables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue (&gt;30 days)</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(overdueAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aging Buckets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aging Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agingBuckets.map((bucket, index) => (
              <AgingSummaryCard
                key={bucket.label}
                label={bucket.label}
                amount={bucket.amount}
                count={bucket.count}
                colorClass={agingColors[index].colorClass}
                bgClass={agingColors[index].bgClass}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client-wise Receivables */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client name or bill number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="age-desc">Age (Oldest First)</SelectItem>
              <SelectItem value="age-asc">Age (Newest First)</SelectItem>
              <SelectItem value="name-asc">Client Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredReceivables.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No clients match your search'
                  : 'No outstanding receivables'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReceivables.map((receivable) => (
              <ClientReceivableCard key={receivable.clientId} receivable={receivable} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivablesReport;
