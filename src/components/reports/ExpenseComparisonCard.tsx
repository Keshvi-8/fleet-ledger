import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { PeriodComparison, getCategoryConfig, ExpenseCategory } from '@/utils/expenseReportUtils';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseComparisonCardProps {
  comparison: PeriodComparison;
}

export function ExpenseComparisonCard({ comparison }: ExpenseComparisonCardProps) {
  const { currentPeriod, previousPeriod, percentageChange } = comparison;
  const categoryConfig = getCategoryConfig();

  const getTrendIcon = (change: number) => {
    if (change > 5) return <TrendingUp className="h-4 w-4" />;
    if (change < -5) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (change: number) => {
    // For expenses, decrease is good (green), increase is bad (red)
    if (change > 5) return 'text-destructive bg-destructive/10';
    if (change < -5) return 'text-emerald-600 bg-emerald-500/10';
    return 'text-muted-foreground bg-muted';
  };

  const categories: { key: ExpenseCategory; change: number }[] = [
    { key: 'diesel', change: percentageChange.diesel },
    { key: 'toll', change: percentageChange.toll },
    { key: 'driverAdvance', change: percentageChange.driverAdvance },
    { key: 'other', change: percentageChange.other },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Period Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Comparison */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Previous Period</p>
                <p className="text-xl font-semibold">{formatCurrency(previousPeriod.totalExpenses)}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Period</p>
                <p className="text-xl font-semibold">{formatCurrency(currentPeriod.totalExpenses)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${getTrendColor(percentageChange.total)}`}>
                {getTrendIcon(percentageChange.total)}
                <span className="font-medium">
                  {percentageChange.total > 0 ? '+' : ''}{percentageChange.total.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Category-wise Comparison */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">By Category</p>
            {categories.map(({ key, change }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: categoryConfig[key].color }}
                  />
                  <span className="text-sm">{categoryConfig[key].label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(previousPeriod.breakdown[key])} → {formatCurrency(currentPeriod.breakdown[key])}
                  </span>
                  <div className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${getTrendColor(change)}`}>
                    {getTrendIcon(change)}
                    <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Insights</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {percentageChange.total > 10 && (
                <li>• Total expenses increased significantly. Review category-wise spending.</li>
              )}
              {percentageChange.total < -10 && (
                <li>• Great job! Total expenses decreased compared to last period.</li>
              )}
              {percentageChange.diesel > 15 && (
                <li>• Diesel costs are up. Consider fuel efficiency optimization.</li>
              )}
              {percentageChange.toll > 20 && (
                <li>• Toll expenses increased. Review route planning for optimization.</li>
              )}
              {currentPeriod.avgCostPerKm > 30 && (
                <li>• Cost per KM is high. Focus on operational efficiency.</li>
              )}
              {currentPeriod.avgCostPerKm < 25 && previousPeriod.avgCostPerKm > 25 && (
                <li>• Cost per KM improved. Keep up the good work!</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
