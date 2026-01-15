import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTrucks, mockDrivers } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Truck, User, Calendar, DollarSign, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export const StartTrip: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [driverAdvance, setDriverAdvance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTrucks = mockTrucks.filter(t => t.status === 'available');
  const availableDrivers = mockDrivers.filter(d => !d.assignedTruckId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Trip started successfully!', {
      description: 'You can now add journeys to this trip.',
    });

    navigate('/manager/trips/active');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-foreground">Start New Trip</h2>
        <p className="text-muted-foreground">
          Select a truck and driver to begin a new trip
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl bg-card p-6 shadow-card space-y-5">
          {/* Truck Selection */}
          <div className="space-y-2">
            <Label htmlFor="truck" className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" />
              Select Truck
            </Label>
            <Select value={selectedTruck} onValueChange={setSelectedTruck}>
              <SelectTrigger id="truck" className="h-11">
                <SelectValue placeholder="Choose a truck" />
              </SelectTrigger>
              <SelectContent>
                {availableTrucks.length > 0 ? (
                  availableTrucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{truck.registrationNumber}</span>
                        <span className="text-muted-foreground">- {truck.model}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No trucks available
                  </div>
                )}
              </SelectContent>
            </Select>
            {availableTrucks.length === 0 && (
              <p className="text-sm text-warning">
                All trucks are currently on trips or under maintenance
              </p>
            )}
          </div>

          {/* Driver Selection */}
          <div className="space-y-2">
            <Label htmlFor="driver" className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              Select Driver
            </Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger id="driver" className="h-11">
                <SelectValue placeholder="Choose a driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.length > 0 ? (
                  availableDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{driver.name}</span>
                        <span className="text-muted-foreground">- {driver.phone}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No drivers available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Driver Advance */}
          <div className="space-y-2">
            <Label htmlFor="advance" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" />
              Driver Advance (Optional)
            </Label>
            <Input
              id="advance"
              type="number"
              placeholder="Enter advance amount"
              value={driverAdvance}
              onChange={(e) => setDriverAdvance(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Cash advance given to driver for trip expenses
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 gradient-accent text-accent-foreground gap-2"
            disabled={!selectedTruck || !selectedDriver || isSubmitting}
          >
            {isSubmitting ? (
              'Starting...'
            ) : (
              <>
                <Check className="h-4 w-4" />
                Start Trip
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
