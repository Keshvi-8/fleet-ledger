import React from 'react';
import { StatCard } from '@/components/common/StatCard';
import { dashboardStats, mockTrips } from '@/utils/mockData';
import { formatCurrency, formatKm, formatNumber } from '@/utils/formatters';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Route,
  Fuel,
  ArrowRight,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { month: 'Jan', income: 420000, expenses: 280000 },
  { month: 'Feb', income: 380000, expenses: 240000 },
  { month: 'Mar', income: 450000, expenses: 290000 },
  { month: 'Apr', income: 520000, expenses: 320000 },
  { month: 'May', income: 480000, expenses: 300000 },
  { month: 'Jun', income: 550000, expenses: 340000 },
];

const expenseBreakdown = [
  { name: 'Diesel', value: 55, color: 'hsl(38, 92%, 50%)' },
  { name: 'Toll', value: 15, color: 'hsl(220, 60%, 25%)' },
  { name: 'Driver Salary', value: 20, color: 'hsl(175, 70%, 40%)' },
  { name: 'Maintenance', value: 10, color: 'hsl(142, 70%, 40%)' },
];

export const OwnerDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Business Overview</h2>
          <p className="text-muted-foreground">Track your fleet performance and financials</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">This Month</Button>
          <Link to="/owner/reports/profit-loss">
            <Button className="gradient-accent text-accent-foreground gap-2">
              <PieChart className="h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats.totalIncome)}
          icon={DollarSign}
          trend={{ value: 15.2, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(dashboardStats.totalExpenses)}
          icon={TrendingDown}
          trend={{ value: 8.1, isPositive: false }}
          variant="warning"
        />
        <StatCard
          title="Net Profit"
          value={formatCurrency(dashboardStats.netProfit)}
          icon={TrendingUp}
          trend={{ value: 22.5, isPositive: true }}
          variant="accent"
        />
        <StatCard
          title="Pending Receivables"
          value={formatCurrency(dashboardStats.pendingAmount)}
          subtitle={`${dashboardStats.pendingBills} bills pending`}
          icon={Receipt}
          variant="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Revenue vs Expenses</h3>
            <Link
              to="/owner/reports/profit-loss"
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 70%, 40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 70%, 40%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(142, 70%, 40%)"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Expense Breakdown</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-card-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{dashboardStats.totalTrips}</p>
              <p className="text-sm text-muted-foreground">Total Trips</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{formatKm(dashboardStats.totalKm)}</p>
              <p className="text-sm text-muted-foreground">Total Distance</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Fuel className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{dashboardStats.avgMileage}</p>
              <p className="text-sm text-muted-foreground">Avg Mileage (km/L)</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">₹{(dashboardStats.netProfit / dashboardStats.totalKm).toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Profit per KM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
