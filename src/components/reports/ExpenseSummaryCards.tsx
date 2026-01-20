import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, IndianRupee, Truck, Route, Receipt } from 'lucide-react';
import { ExpenseSummary, PeriodComparison, formatExpenseValue } from '@/utils/expenseReportUtils';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseSummaryCardsProps {
  summary: ExpenseSummary;
  comparison: PeriodComparison;
}

export function ExpenseSummaryCards({ summary, comparison }: ExpenseSummaryCardsProps) {
  const { percentageChange } = comparison;

  const getTrendIcon = (change: number) => {
    if (change > 5) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (change < -5) return <TrendingDown className="h-4 w-4 text-emerald-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number, isExpense = true) => {
    if (change > 5) return isExpense ? 'text-destructive' : 'text-emerald-600';
    if (change < -5) return isExpense ? 'text-emerald-600' : 'text-destructive';
    return 'text-muted-foreground';
  };

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      change: percentageChange.total,
      icon: IndianRupee,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    {
      title: 'Avg per Trip',
      value: formatCurrency(summary.avgExpensePerTrip),
      subtitle: `${summary.totalTrips} trips`,
      icon: Receipt,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Cost per KM',
      value: `₹${summary.avgCostPerKm.toFixed(2)}`,
      subtitle: `${summary.totalKm.toLocaleString()} km`,
      icon: Route,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Highest Category',
      value: summary.highestCategory,
      subtitle: formatExpenseValue(summary.categoryData.find(c => c.label === summary.highestCategory)?.amount || 0),
      icon: Truck,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                {card.change !== undefined ? (
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(card.change)}`}>
                    {getTrendIcon(card.change)}
                    <span>{Math.abs(card.change).toFixed(1)}% vs last period</span>
                  </div>
                ) : card.subtitle ? (
                  <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                ) : null}
              </div>
              <div className={`rounded-lg p-3 ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
