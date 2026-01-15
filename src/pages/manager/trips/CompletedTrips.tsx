import React from 'react';
import { TripCard } from '@/components/cards/TripCard';
import { mockTrips } from '@/utils/mockData';
import { CheckCircle, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const CompletedTrips: React.FC = () => {
  const completedTrips = mockTrips.filter(t => t.status === 'completed' || t.status === 'locked');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Completed Trips</h2>
          <p className="text-sm text-muted-foreground">
            {completedTrips.length} trip{completedTrips.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by truck number, driver..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Trips Grid */}
      {completedTrips.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {completedTrips.map((trip, index) => (
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
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-6 text-xl font-medium text-foreground">No completed trips</h3>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Completed trips will appear here once trips are ended.
          </p>
        </div>
      )}
    </div>
  );
};
