import React, { useState, useEffect } from 'react';
import { mockClients } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Weight, IndianRupee, Building2, Route, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface JourneyFormProps {
  tripId: string;
  truckNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (journey: {
    clientId: string;
    fromLocation: string;
    toLocation: string;
    weight: number;
    ratePerTon: number;
    freightAmount: number;
    clientAdvance: number;
  }) => void;
}

export const JourneyForm: React.FC<JourneyFormProps> = ({
  tripId,
  truckNumber,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [clientId, setClientId] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [ratePerTon, setRatePerTon] = useState('');
  const [clientAdvance, setClientAdvance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate freight
  const calculatedFreight = 
    weight && ratePerTon 
      ? parseFloat(weight) * parseFloat(ratePerTon) 
      : 0;

  const resetForm = () => {
    setClientId('');
    setFromLocation('');
    setToLocation('');
    setWeight('');
    setRatePerTon('');
    setClientAdvance('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    onSubmit({
      clientId,
      fromLocation,
      toLocation,
      weight: parseFloat(weight),
      ratePerTon: parseFloat(ratePerTon),
      freightAmount: calculatedFreight,
      clientAdvance: parseFloat(clientAdvance) || 0,
    });

    toast.success('Journey added successfully!', {
      description: `${fromLocation} → ${toLocation} | ${formatCurrency(calculatedFreight)}`,
    });

    resetForm();
    setIsSubmitting(false);
    onClose();
  };

  const selectedClient = mockClients.find(c => c.id === clientId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <Route className="h-5 w-5 text-accent" />
            Add Journey to Trip
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Truck: <span className="font-medium text-card-foreground">{truckNumber}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              Select Client
            </Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client" className="h-11 bg-background">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-xs text-muted-foreground">GST: {client.gstNumber}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClient && (
              <p className="text-xs text-muted-foreground">
                Address: {selectedClient.address}
              </p>
            )}
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-success" />
                From Location
              </Label>
              <Input
                id="from"
                placeholder="e.g., Pune"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-destructive" />
                To Location
              </Label>
              <Input
                id="to"
                placeholder="e.g., Mumbai"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>

          {/* Weight & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-accent" />
                Weight (tons)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 25"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate" className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-accent" />
                Rate per Ton (₹)
              </Label>
              <Input
                id="rate"
                type="number"
                min="0"
                placeholder="e.g., 2500"
                value={ratePerTon}
                onChange={(e) => setRatePerTon(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>

          {/* Auto-calculated Freight */}
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-card-foreground">
                  Calculated Freight
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent">
                  {formatCurrency(calculatedFreight)}
                </p>
                {weight && ratePerTon && (
                  <p className="text-xs text-muted-foreground">
                    {weight} tons × ₹{ratePerTon}/ton
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Client Advance */}
          <div className="space-y-2">
            <Label htmlFor="advance" className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-accent" />
              Client Advance (Optional)
            </Label>
            <Input
              id="advance"
              type="number"
              min="0"
              placeholder="Advance received from client"
              value={clientAdvance}
              onChange={(e) => setClientAdvance(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Balance after advance: {formatCurrency(calculatedFreight - (parseFloat(clientAdvance) || 0))}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-accent text-accent-foreground"
              disabled={!clientId || !fromLocation || !toLocation || !weight || !ratePerTon || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Journey'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
