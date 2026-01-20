import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyExpenseTrend, getCategoryConfig } from '@/utils/expenseReportUtils';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseTrendsChartProps {
  trends: MonthlyExpenseTrend[];
}

export function ExpenseTrendsChart({ trends }: ExpenseTrendsChartProps) {
  const categoryConfig = getCategoryConfig();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="rounded-lg border bg-background p-4 shadow-lg">
          <p className="mb-2 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
          <div className="mt-2 border-t pt-2">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (trends.length === 0 || trends.every(t => t.total === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Expense Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly Expense Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDiesel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={categoryConfig.diesel.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={categoryConfig.diesel.color} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorToll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={categoryConfig.toll.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={categoryConfig.toll.color} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDriverAdvance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={categoryConfig.driverAdvance.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={categoryConfig.driverAdvance.color} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={categoryConfig.other.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={categoryConfig.other.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="diesel"
                name="Diesel"
                stackId="1"
                stroke={categoryConfig.diesel.color}
                fill="url(#colorDiesel)"
              />
              <Area
                type="monotone"
                dataKey="toll"
                name="Toll"
                stackId="1"
                stroke={categoryConfig.toll.color}
                fill="url(#colorToll)"
              />
              <Area
                type="monotone"
                dataKey="driverAdvance"
                name="Driver Advance"
                stackId="1"
                stroke={categoryConfig.driverAdvance.color}
                fill="url(#colorDriverAdvance)"
              />
              <Area
                type="monotone"
                dataKey="other"
                name="Other"
                stackId="1"
                stroke={categoryConfig.other.color}
                fill="url(#colorOther)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
