import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/manager': 'Dashboard',
    '/manager/trucks': 'Truck Management',
    '/manager/drivers': 'Driver Management',
    '/manager/clients': 'Client Management',
    '/manager/petrol-pumps': 'Petrol Pump Management',
    '/manager/trips/active': 'Active Trips',
    '/manager/trips/start': 'Start New Trip',
    '/manager/trips/completed': 'Completed Trips',
    '/manager/expenses': 'Record Expenses',
    '/manager/transactions': 'Transactions',
    '/owner': 'Owner Dashboard',
    '/owner/reports/trucks': 'Truck Reports',
    '/owner/reports/profit-loss': 'Profit & Loss Report',
    '/owner/reports/expenses': 'Expense Report',
    '/owner/reports/receivables': 'Receivables Report',
    '/owner/billing/list': 'All Bills',
    '/owner/billing/generate': 'Generate Bills',
    '/owner/monitoring/trips': 'All Trips',
    '/owner/monitoring/accounts': 'Accounts Overview',
  };
  return titles[pathname] || 'Dashboard';
};

export const Header: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-9 bg-secondary border-0"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>
      </div>
    </header>
  );
};
