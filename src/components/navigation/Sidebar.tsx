import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Truck,
  Users,
  Building2,
  Fuel,
  Route,
  FileText,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  ChevronRight,
  CircleDot,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const managerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/manager', icon: LayoutDashboard },
  {
    label: 'Master Data',
    href: '/manager/master',
    icon: Settings,
    children: [
      { label: 'Trucks', href: '/manager/trucks' },
      { label: 'Drivers', href: '/manager/drivers' },
      { label: 'Clients', href: '/manager/clients' },
      { label: 'Petrol Pumps', href: '/manager/petrol-pumps' },
    ],
  },
  {
    label: 'Trips',
    href: '/manager/trips',
    icon: Route,
    children: [
      { label: 'Active Trips', href: '/manager/trips/active' },
      { label: 'Start Trip', href: '/manager/trips/start' },
      { label: 'Completed', href: '/manager/trips/completed' },
    ],
  },
  { label: 'Expenses', href: '/manager/expenses', icon: Receipt },
  { label: 'Transactions', href: '/manager/transactions', icon: FileText },
];

const ownerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/owner', icon: LayoutDashboard },
  {
    label: 'Reports',
    href: '/owner/reports',
    icon: BarChart3,
    children: [
      { label: 'Truck Reports', href: '/owner/reports/trucks' },
      { label: 'Profit & Loss', href: '/owner/reports/profit-loss' },
      { label: 'Expenses', href: '/owner/reports/expenses' },
      { label: 'Receivables', href: '/owner/reports/receivables' },
    ],
  },
  {
    label: 'Billing',
    href: '/owner/billing',
    icon: Receipt,
    children: [
      { label: 'All Bills', href: '/owner/billing/list' },
      { label: 'Generate Bills', href: '/owner/billing/generate' },
    ],
  },
  {
    label: 'Monitoring',
    href: '/owner/monitoring',
    icon: CircleDot,
    children: [
      { label: 'All Trips', href: '/owner/monitoring/trips' },
      { label: 'Accounts', href: '/owner/monitoring/accounts' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navItems = user?.role === 'owner' ? ownerNavItems : managerNavItems;

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (item: NavItem) =>
    item.children?.some(child => location.pathname === child.href);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent">
            <Truck className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">TransFleet</h1>
            <p className="text-xs text-sidebar-muted capitalize">{user?.role} Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.href)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isParentActive(item)
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </div>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          expandedItems.includes(item.href) && 'rotate-90'
                        )}
                      />
                    </button>
                    {expandedItems.includes(item.href) && (
                      <ul className="mt-1 space-y-1 pl-11">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              to={child.href}
                              className={cn(
                                'block rounded-lg px-3 py-2 text-sm transition-colors',
                                isActive(child.href)
                                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                  : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-medium">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-muted capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-sidebar-muted hover:bg-sidebar-border hover:text-sidebar-foreground transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
