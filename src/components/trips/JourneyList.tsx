import React from 'react';
import { Journey } from '@/utils/mockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { MapPin, Route, Weight, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyListProps {
  journeys: Journey[];
  className?: string;
}

export const JourneyList: React.FC<JourneyListProps> = ({ journeys, className }) => {
  if (journeys.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Route className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No journeys added yet</p>
        <p className="text-sm">Add your first journey to this trip</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {journeys.map((journey, index) => (
        <div
          key={journey.id}
          className="relative p-4 bg-card rounded-xl border border-border hover:border-accent/30 transition-colors"
        >
          {/* Journey Number Badge */}
          <div className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {index + 1}
          </div>

          <div className="space-y-3">
            {/* Client & Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-card-foreground">{journey.clientName}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(journey.createdAt)}
              </span>
            </div>

            {/* Route */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-success" />
              <span className="text-card-foreground">{journey.fromLocation}</span>
              <Route className="h-4 w-4 text-muted-foreground mx-1" />
              <MapPin className="h-4 w-4 text-destructive" />
              <span className="text-card-foreground">{journey.toLocation}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-medium text-card-foreground">{journey.weight} T</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="text-sm font-medium text-card-foreground">₹{journey.ratePerTon.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Freight</p>
                <p className="text-sm font-medium text-success">{formatCurrency(journey.freightAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Advance</p>
                <p className="text-sm font-medium text-accent">{formatCurrency(journey.clientAdvance)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-success/5 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <span className="font-medium text-card-foreground">Total Freight</span>
          <span className="text-xl font-bold text-success">
            {formatCurrency(journeys.reduce((sum, j) => sum + j.freightAmount, 0))}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-muted-foreground">Total Advance Received</span>
          <span className="text-sm font-medium text-accent">
            {formatCurrency(journeys.reduce((sum, j) => sum + j.clientAdvance, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};
