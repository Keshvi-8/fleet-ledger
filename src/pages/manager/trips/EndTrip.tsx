import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockTrips } from '@/utils/mockData';
import { EndTripForm } from '@/components/forms/EndTripForm';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  ArrowLeft,
  Truck,
  User,
  Calendar,
  Route,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export const EndTrip: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedData, setCompletedData] = useState<{
    profit: number;
    mileage: number;
  } | null>(null);

  const trip = mockTrips.find(t => t.id === tripId);

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

  if (trip.status !== 'running') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle2 className="h-16 w-16 text-success/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground">Trip Already Completed</h2>
        <p className="text-muted-foreground mt-2">This trip has already been ended.</p>
        <Link to="/manager/trips/completed">
          <Button className="mt-4">View Completed Trips</Button>
        </Link>
      </div>
    );
  }

  if (trip.journeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MapPin className="h-16 w-16 text-warning/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground">No Journeys Added</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-center">
          You need to add at least one journey before ending this trip.
        </p>
        <Link to={`/manager/trips/${trip.id}`}>
          <Button className="mt-4">Add Journeys</Button>
        </Link>
      </div>
    );
  }

  const handleEndTrip = (data: {
    totalKm: number;
    petrolPumpId: string;
    dieselQuantity: number;
    tollExpense?: number;
    otherExpense?: number;
    dieselAmount: number;
    totalExpense: number;
    profit: number;
    mileage: number;
  }) => {
    // In a real app, this would call an API
    console.log('Ending trip with data:', data);
    
    setCompletedData({
      profit: data.profit,
      mileage: data.mileage,
    });
    setShowSuccess(true);
    
    toast.success('Trip completed successfully!', {
      description: `Profit: ${formatCurrency(data.profit)}`,
    });
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/manager/trips/completed');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Trip</span>
      </button>

      {/* Header */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
            <Truck className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">End Trip</h1>
            <p className="text-sm text-muted-foreground">
              Complete trip for {trip.truckNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{trip.truckNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{trip.driverName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(trip.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{trip.journeys.length} journeys</span>
          </div>
        </div>
      </div>

      {/* End Trip Form */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border">
        <EndTripForm
          trip={trip}
          onSubmit={handleEndTrip}
          onCancel={() => navigate(-1)}
        />
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-xl">Trip Completed!</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>Trip for {trip.truckNumber} has been successfully completed.</p>
              {completedData && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Profit</span>
                    <span className={completedData.profit >= 0 ? 'text-success font-bold' : 'text-destructive font-bold'}>
                      {formatCurrency(completedData.profit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage</span>
                    <span className="font-medium">{completedData.mileage} km/L</span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button onClick={handleSuccessClose} className="w-full gradient-primary text-primary-foreground">
              View Completed Trips
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
