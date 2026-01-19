import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ExpenseBreakdown, getExpensePercentages } from '@/utils/profitLossUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Fuel, CircleDollarSign, Wallet, MoreHorizontal } from 'lucide-react';

interface ExpenseBreakdownChartProps {
  breakdown: ExpenseBreakdown;
  totalExpenses: number;
}

const EXPENSE_CONFIG = {
  diesel: { label: 'Diesel', color: '#ef4444', icon: Fuel },
  toll: { label: 'Toll', color: '#f59e0b', icon: CircleDollarSign },
  driverAdvance: { label: 'Driver Advance', color: '#3b82f6', icon: Wallet },
  other: { label: 'Other', color: '#8b5cf6', icon: MoreHorizontal },
};

export function ExpenseBreakdownChart({ breakdown, totalExpenses }: ExpenseBreakdownChartProps) {
  const percentages = getExpensePercentages(breakdown);
  
  const chartData = Object.entries(breakdown).map(([key, value]) => ({
    name: EXPENSE_CONFIG[key as keyof ExpenseBreakdown].label,
    value,
    color: EXPENSE_CONFIG[key as keyof ExpenseBreakdown].color,
    percentage: percentages[key as keyof ExpenseBreakdown],
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="h-48">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
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
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No expense data
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {Object.entries(EXPENSE_CONFIG).map(([key, config]) => {
              const value = breakdown[key as keyof ExpenseBreakdown];
              const percentage = percentages[key as keyof ExpenseBreakdown];
              const Icon = config.icon;
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config.color }}
                    />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{config.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(value)}</p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
