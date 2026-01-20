import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateExpenseReport } from '@/utils/expenseReportUtils';
import { TimeFrame } from '@/utils/profitLossUtils';
import { ExpenseSummaryCards } from '@/components/reports/ExpenseSummaryCards';
import { ExpenseCategoryBreakdown } from '@/components/reports/ExpenseCategoryBreakdown';
import { ExpenseTrendsChart } from '@/components/reports/ExpenseTrendsChart';
import { ExpenseByTruckTable } from '@/components/reports/ExpenseByTruckTable';
import { ExpenseComparisonCard } from '@/components/reports/ExpenseComparisonCard';

const TIME_FRAME_OPTIONS = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export default function ExpenseReport() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('this_month');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const report = useMemo(() => {
    return generateExpenseReport(
      timeFrame,
      customDateRange.from,
      customDateRange.to
    );
  }, [timeFrame, customDateRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expense Report</h1>
          <p className="text-muted-foreground">
            Detailed expense tracking by category with trends and comparisons
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Period:</span>
              <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v as TimeFrame)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_FRAME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {timeFrame === 'custom' && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[140px] justify-start text-left font-normal',
                        !customDateRange.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange.from ? format(customDateRange.from, 'dd MMM yyyy') : 'Start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customDateRange.from}
                      onSelect={(date) => setCustomDateRange((prev) => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">to</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[140px] justify-start text-left font-normal',
                        !customDateRange.to && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange.to ? format(customDateRange.to, 'dd MMM yyyy') : 'End date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customDateRange.to}
                      onSelect={(date) => setCustomDateRange((prev) => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              Showing: <span className="font-medium">{report.timeFrame.label}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <ExpenseSummaryCards summary={report.summary} comparison={report.comparison} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <ExpenseCategoryBreakdown 
          categoryData={report.summary.categoryData} 
          totalExpenses={report.summary.totalExpenses} 
        />

        {/* Period Comparison */}
        <ExpenseComparisonCard comparison={report.comparison} />
      </div>

      {/* Trends Chart */}
      <ExpenseTrendsChart trends={report.trends} />

      {/* Truck Table */}
      <ExpenseByTruckTable truckData={report.byTruck} />
    </div>
  );
}
