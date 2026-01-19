import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { CalendarIcon, Download, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  generateProfitLossReport, 
  TimeFrame, 
  GroupBy 
} from '@/utils/profitLossUtils';
import { ProfitLossSummaryCards } from '@/components/reports/ProfitLossSummaryCards';
import { ExpenseBreakdownChart } from '@/components/reports/ExpenseBreakdownChart';
import { ProfitLossTable } from '@/components/reports/ProfitLossTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

export function ProfitLossReport() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('this_month');
  const [groupBy, setGroupBy] = useState<GroupBy>('truck');
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const report = useMemo(() => {
    return generateProfitLossReport(
      timeFrame,
      groupBy,
      customDateRange.from,
      customDateRange.to
    );
  }, [timeFrame, groupBy, customDateRange]);

  const chartData = report.entries.map(entry => ({
    name: entry.label.length > 12 ? entry.label.slice(0, 12) + '...' : entry.label,
    fullName: entry.label,
    income: entry.income,
    expenses: entry.totalExpense,
    profit: entry.grossProfit,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-600">Income: {formatCurrency(data.income)}</p>
            <p className="text-rose-600">Expenses: {formatCurrency(data.expenses)}</p>
            <p className={cn(
              "font-medium",
              data.profit >= 0 ? "text-blue-600" : "text-orange-600"
            )}>
              Profit: {formatCurrency(data.profit)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const groupByLabels: Record<GroupBy, string> = {
    truck: 'Truck',
    month: 'Month',
    overall: 'Overall',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Profit & Loss Report
          </h1>
          <p className="text-muted-foreground mt-1">
            {report.timeFrame.label}
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Time Frame Select */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Period:</span>
              <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v as TimeFrame)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {timeFrame === 'custom' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDateRange.from ? (
                      customDateRange.to ? (
                        <>
                          {format(customDateRange.from, 'dd MMM')} -{' '}
                          {format(customDateRange.to, 'dd MMM yyyy')}
                        </>
                      ) : (
                        format(customDateRange.from, 'dd MMM yyyy')
                      )
                    ) : (
                      'Pick date range'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: customDateRange.from, to: customDateRange.to }}
                    onSelect={(range) => setCustomDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Group By Select */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View by:</span>
              <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">By Truck</SelectItem>
                  <SelectItem value="month">By Month</SelectItem>
                  <SelectItem value="overall">Overall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <ProfitLossSummaryCards summary={report.summary} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                      className="text-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="income" 
                      name="Income" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="expenses" 
                      name="Expenses" 
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <ExpenseBreakdownChart 
          breakdown={report.summary.expenseBreakdown} 
          totalExpenses={report.summary.totalExpenses}
        />
      </div>

      {/* Detailed Table */}
      <ProfitLossTable 
        entries={report.entries} 
        groupByLabel={groupByLabels[groupBy]}
      />
    </div>
  );
}

export default ProfitLossReport;
