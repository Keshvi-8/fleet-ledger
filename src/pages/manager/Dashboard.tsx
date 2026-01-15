import React from 'react';
import { StatCard } from '@/components/common/StatCard';
import { TripCard } from '@/components/cards/TripCard';
import { mockTrips, mockTrucks, dashboardStats } from '@/utils/mockData';
import { formatCurrency, formatKm, formatNumber } from '@/utils/formatters';
import { 
  Truck, 
  Route, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Fuel,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const ManagerDashboard: React.FC = () => {
  const activeTrips = mockTrips.filter(t => t.status === 'running');
  const availableTrucks = mockTrucks.filter(t => t.status === 'available').length;
  const trucksOnTrip = mockTrucks.filter(t => t.status === 'on_trip').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Good morning! 👋</h2>
          <p className="text-muted-foreground">Here's what's happening with your fleet today.</p>
        </div>
        <Link to="/manager/trips/start">
          <Button className="gradient-accent text-accent-foreground gap-2">
            <Plus className="h-4 w-4" />
            Start New Trip
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Trips"
          value={dashboardStats.activeTrips}
          subtitle={`${trucksOnTrip} trucks on road`}
          icon={Route}
          variant="accent"
        />
        <StatCard
          title="Available Trucks"
          value={availableTrucks}
          subtitle={`of ${mockTrucks.length} total`}
          icon={Truck}
          variant="primary"
        />
        <StatCard
          title="This Month's Revenue"
          value={formatCurrency(dashboardStats.totalIncome)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Total Distance"
          value={formatKm(dashboardStats.totalKm)}
          subtitle={`Avg ${dashboardStats.avgMileage} km/L mileage`}
          icon={Fuel}
          variant="warning"
        />
      </div>

      {/* Active Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Trips</h3>
          <Link 
            to="/manager/trips/active" 
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {activeTrips.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activeTrips.map((trip, index) => (
              <div
                key={trip.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <Route className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h4 className="mt-4 text-lg font-medium text-foreground">No active trips</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a new trip to get your fleet moving
            </p>
            <Link to="/manager/trips/start">
              <Button className="mt-4 gradient-accent text-accent-foreground">
                Start Trip
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Fleet Status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Fleet Status</h3>
          <div className="space-y-3">
            {mockTrucks.map((truck) => (
              <div 
                key={truck.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    truck.status === 'available' && 'bg-success',
                    truck.status === 'on_trip' && 'bg-accent',
                    truck.status === 'maintenance' && 'bg-warning'
                  )} />
                  <div>
                    <p className="font-medium text-card-foreground">{truck.registrationNumber}</p>
                    <p className="text-sm text-muted-foreground">{truck.model}</p>
                  </div>
                </div>
                <span className={cn(
                  'text-sm font-medium capitalize px-2.5 py-1 rounded-full',
                  truck.status === 'available' && 'bg-success/10 text-success',
                  truck.status === 'on_trip' && 'bg-accent/10 text-accent',
                  truck.status === 'maintenance' && 'bg-warning/10 text-warning'
                )}>
                  {truck.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Add New Truck', href: '/manager/trucks', icon: Truck },
              { label: 'Add New Driver', href: '/manager/drivers', icon: Users },
              { label: 'Record Expense', href: '/manager/expenses', icon: DollarSign },
              { label: 'View Transactions', href: '/manager/transactions', icon: TrendingUp },
            ].map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary group-hover:gradient-accent transition-all">
                  <action.icon className="h-4 w-4 text-secondary-foreground group-hover:text-accent-foreground" />
                </div>
                <span className="text-sm font-medium text-card-foreground">{action.label}</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
