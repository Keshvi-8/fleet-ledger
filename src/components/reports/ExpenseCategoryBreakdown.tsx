import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Fuel, CircleDollarSign, Wallet, MoreHorizontal } from 'lucide-react';
import { CategoryExpenseData, ExpenseCategory } from '@/utils/expenseReportUtils';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseCategoryBreakdownProps {
  categoryData: CategoryExpenseData[];
  totalExpenses: number;
}

const CATEGORY_ICONS: Record<ExpenseCategory, React.ElementType> = {
  diesel: Fuel,
  toll: CircleDollarSign,
  driverAdvance: Wallet,
  other: MoreHorizontal,
};

export function ExpenseCategoryBreakdown({ categoryData, totalExpenses }: ExpenseCategoryBreakdownProps) {
  const chartData = categoryData
    .filter(c => c.amount > 0)
    .map(c => ({
      name: c.label,
      value: c.amount,
      percentage: c.percentage,
      color: c.color,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Details */}
          <div className="space-y-4">
            {categoryData.map((category) => {
              const Icon = CATEGORY_ICONS[category.category];
              return (
                <div key={category.category} className="flex items-center gap-4">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: category.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{category.label}</p>
                      <p className="font-semibold">{formatCurrency(category.amount)}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{category.percentage.toFixed(1)}% of total</span>
                      <span>Avg ₹{category.avgPerTrip.toLocaleString()} / trip</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
