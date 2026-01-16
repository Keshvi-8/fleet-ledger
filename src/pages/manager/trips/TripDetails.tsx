import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockTrips, Journey } from '@/utils/mockData';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { JourneyList } from '@/components/trips/JourneyList';
import { JourneyForm } from '@/components/forms/JourneyForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ArrowLeft,
  Truck,
  User,
  Calendar,
  Plus,
  Route,
  CheckCircle,
  IndianRupee,
} from 'lucide-react';
import { toast } from 'sonner';

export const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [isAddJourneyOpen, setIsAddJourneyOpen] = useState(false);
  const [journeys, setJourneys] = useState<Journey[]>([]);

  // Find the trip
  const trip = mockTrips.find(t => t.id === tripId);

  // Initialize journeys from trip
  React.useEffect(() => {
    if (trip) {
      setJourneys(trip.journeys);
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Route className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Trip Not Found</h2>
        <p className="text-muted-foreground mt-2">The trip you're looking for doesn't exist.</p>
        <Link to="/manager/trips/active">
          <Button className="mt-4">Back to Active Trips</Button>
        </Link>
      </div>
    );
  }

  const handleAddJourney = (data: {
    clientId: string;
    clientName: string;
    fromLocation: string;
    toLocation: string;
    weight: number;
    ratePerTon: number;
    freightAmount: number;
    clientAdvance?: number;
  }) => {
    const newJourney: Journey = {
      id: `j-${Date.now()}`,
      tripId: trip.id,
      clientId: data.clientId,
      clientName: data.clientName,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      weight: data.weight,
      ratePerTon: data.ratePerTon,
      freightAmount: data.freightAmount,
      clientAdvance: data.clientAdvance || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setJourneys(prev => [...prev, newJourney]);
    setIsAddJourneyOpen(false);
    toast.success('Journey added successfully!', {
      description: `${data.fromLocation} → ${data.toLocation}`,
    });
  };

  const totalFreight = journeys.reduce((sum, j) => sum + j.freightAmount, 0);
  const totalAdvance = journeys.reduce((sum, j) => sum + j.clientAdvance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Trips</span>
      </button>

      {/* Trip Header Card */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">{trip.truckNumber}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{trip.driverName}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Started: {formatDate(trip.startDate)}</span>
              </div>
              {trip.endDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ended: {formatDate(trip.endDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3">
            <TripStatusBadge status={trip.status} />
            {trip.status === 'running' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddJourneyOpen(true)}
                  className="gradient-accent text-accent-foreground gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Journey
                </Button>
                <Link to={`/manager/trips/${trip.id}/end`}>
                  <Button variant="outline" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    End Trip
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Journeys</p>
            <p className="text-xl font-bold text-card-foreground">{journeys.length}</p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Freight</p>
            <p className="text-xl font-bold text-success">{formatCurrency(totalFreight)}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Advance Received</p>
            <p className="text-xl font-bold text-accent">{formatCurrency(totalAdvance)}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Driver Advance</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(trip.driverAdvance)}</p>
          </div>
        </div>
      </div>

      {/* Journeys Section */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Journeys
          </h2>
          {trip.status === 'running' && journeys.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddJourneyOpen(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          )}
        </div>

        <JourneyList journeys={journeys} />
      </div>

      {/* Add Journey Dialog */}
      <Dialog open={isAddJourneyOpen} onOpenChange={setIsAddJourneyOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Add New Journey
            </DialogTitle>
            <DialogDescription>
              Add a journey to trip {trip.truckNumber}. Freight amount is auto-calculated.
            </DialogDescription>
          </DialogHeader>
          <JourneyForm
            tripId={trip.id}
            onSubmit={handleAddJourney}
            onCancel={() => setIsAddJourneyOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
