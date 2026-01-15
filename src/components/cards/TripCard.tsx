import React from 'react';
import { Trip } from '@/utils/mockData';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { formatCurrency, formatDate, formatKm } from '@/utils/formatters';
import { Truck, User, MapPin, Calendar, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  className?: string;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick, className }) => {
  const latestJourney = trip.journeys[trip.journeys.length - 1];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover cursor-pointer border border-transparent hover:border-accent/20',
        className
      )}
    >
      {/* Status indicator line */}
      <div className={cn(
        'absolute left-0 top-0 h-full w-1',
        trip.status === 'running' && 'bg-success',
        trip.status === 'completed' && 'bg-warning',
        trip.status === 'locked' && 'bg-muted-foreground'
      )} />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{trip.truckNumber}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {trip.driverName}
              </div>
            </div>
          </div>
          <TripStatusBadge status={trip.status} />
        </div>

        {/* Journey Info */}
        {latestJourney && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            <span>{latestJourney.fromLocation}</span>
            <Route className="h-4 w-4" />
            <span>{latestJourney.toLocation}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Started</p>
            <p className="text-sm font-medium text-card-foreground">
              {formatDate(trip.startDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Journeys</p>
            <p className="text-sm font-medium text-card-foreground">
              {trip.journeys.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-sm font-medium text-success">
              {formatCurrency(trip.totalIncome)}
            </p>
          </div>
        </div>

        {trip.status === 'completed' && (
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="text-sm font-medium text-card-foreground">
                {formatKm(trip.totalKm || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-sm font-medium text-destructive">
                {formatCurrency(trip.totalExpense)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit</p>
              <p className={cn(
                'text-sm font-medium',
                trip.profit >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {formatCurrency(trip.profit)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
