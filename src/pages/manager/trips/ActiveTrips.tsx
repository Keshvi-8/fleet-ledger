import React from 'react';
import { TripCard } from '@/components/cards/TripCard';
import { mockTrips } from '@/utils/mockData';
import { Route, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

export const ActiveTrips: React.FC = () => {
  const navigate = useNavigate();
  const activeTrips = mockTrips.filter(t => t.status === 'running');

  const handleTripClick = (tripId: string) => {
    navigate(`/manager/trips/${tripId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Active Trips</h2>
          <p className="text-sm text-muted-foreground">
            {activeTrips.length} trip{activeTrips.length !== 1 ? 's' : ''} currently running
          </p>
        </div>
        <Link to="/manager/trips/start">
          <Button className="gradient-accent text-accent-foreground gap-2">
            <Plus className="h-4 w-4" />
            Start New Trip
          </Button>
        </Link>
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
      {activeTrips.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeTrips.map((trip, index) => (
            <div
              key={trip.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TripCard trip={trip} onClick={() => handleTripClick(trip.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Route className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-6 text-xl font-medium text-foreground">No active trips</h3>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            All trucks are currently available. Start a new trip to begin tracking.
          </p>
          <Link to="/manager/trips/start">
            <Button className="mt-6 gradient-accent text-accent-foreground">
              Start New Trip
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
