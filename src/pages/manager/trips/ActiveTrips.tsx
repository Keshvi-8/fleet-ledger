import React, { useState } from 'react';
import { TripCard } from '@/components/cards/TripCard';
import { JourneyForm } from '@/components/forms/JourneyForm';
import { mockTrips, Trip, Journey } from '@/utils/mockData';
import { Route, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

export const ActiveTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isJourneyFormOpen, setIsJourneyFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTrips = trips.filter(t => t.status === 'running');

  const filteredTrips = activeTrips.filter(
    (trip) =>
      trip.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddJourney = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsJourneyFormOpen(true);
  };

  const handleJourneySubmit = (journeyData: {
    clientId: string;
    fromLocation: string;
    toLocation: string;
    weight: number;
    ratePerTon: number;
    freightAmount: number;
    clientAdvance: number;
  }) => {
    if (!selectedTrip) return;

    const newJourney: Journey = {
      id: `journey-${Date.now()}`,
      tripId: selectedTrip.id,
      clientId: journeyData.clientId,
      clientName: mockTrips.find(t => t.id === selectedTrip.id)?.journeys[0]?.clientName || 'Client',
      fromLocation: journeyData.fromLocation,
      toLocation: journeyData.toLocation,
      weight: journeyData.weight,
      ratePerTon: journeyData.ratePerTon,
      freightAmount: journeyData.freightAmount,
      clientAdvance: journeyData.clientAdvance,
      createdAt: new Date().toISOString(),
    };

    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === selectedTrip.id
          ? {
              ...trip,
              journeys: [...trip.journeys, newJourney],
              totalIncome: trip.totalIncome + journeyData.freightAmount,
            }
          : trip
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Active Trips</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} currently running
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTrips.map((trip, index) => (
            <div
              key={trip.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TripCard 
                trip={trip} 
                onAddJourney={() => handleAddJourney(trip)}
              />
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

      {/* Journey Form Dialog */}
      {selectedTrip && (
        <JourneyForm
          tripId={selectedTrip.id}
          truckNumber={selectedTrip.truckNumber}
          isOpen={isJourneyFormOpen}
          onClose={() => {
            setIsJourneyFormOpen(false);
            setSelectedTrip(null);
          }}
          onSubmit={handleJourneySubmit}
        />
      )}
    </div>
  );
};
