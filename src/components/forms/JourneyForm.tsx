import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { mockClients, Client } from '@/utils/mockData';
import { formatCurrency } from '@/utils/formatters';
import { MapPin, Weight, IndianRupee, Calculator, Building2 } from 'lucide-react';

const journeySchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  fromLocation: z.string().min(1, 'Pickup location is required').max(100),
  toLocation: z.string().min(1, 'Drop location is required').max(100),
  weight: z.number().min(0.1, 'Weight must be greater than 0').max(100, 'Weight cannot exceed 100 tons'),
  ratePerTon: z.number().min(1, 'Rate must be greater than 0').max(100000),
  clientAdvance: z.number().min(0).max(10000000).optional(),
});

type JourneyFormData = z.infer<typeof journeySchema>;

interface JourneyFormProps {
  tripId: string;
  onSubmit: (data: JourneyFormData & { freightAmount: number; clientName: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const JourneyForm: React.FC<JourneyFormProps> = ({
  tripId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [weight, setWeight] = useState<number>(0);
  const [ratePerTon, setRatePerTon] = useState<number>(0);
  const [freightAmount, setFreightAmount] = useState<number>(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JourneyFormData>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      clientAdvance: 0,
    },
  });

  // Watch weight and rate for auto-calculation
  const watchedWeight = watch('weight');
  const watchedRate = watch('ratePerTon');

  useEffect(() => {
    const w = Number(watchedWeight) || 0;
    const r = Number(watchedRate) || 0;
    const freight = w * r;
    setWeight(w);
    setRatePerTon(r);
    setFreightAmount(freight);
  }, [watchedWeight, watchedRate]);

  const handleClientChange = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setValue('clientId', clientId);
  };

  const onFormSubmit = (data: JourneyFormData) => {
    onSubmit({
      ...data,
      freightAmount,
      clientName: selectedClient?.name || '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Client Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Select Client
        </Label>
        <Select onValueChange={handleClientChange}>
          <SelectTrigger className={errors.clientId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Choose a client" />
          </SelectTrigger>
          <SelectContent>
            {mockClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                <div className="flex flex-col">
                  <span>{client.name}</span>
                  <span className="text-xs text-muted-foreground">{client.address}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.clientId && (
          <p className="text-sm text-destructive">{errors.clientId.message}</p>
        )}
        {selectedClient && (
          <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">GST: {selectedClient.gstNumber}</p>
            <p className="text-muted-foreground">WhatsApp: {selectedClient.whatsappNumber}</p>
          </div>
        )}
      </div>

      {/* Locations */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fromLocation" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-success" />
            Pickup Location
          </Label>
          <Input
            id="fromLocation"
            placeholder="e.g., Pune"
            {...register('fromLocation')}
            className={errors.fromLocation ? 'border-destructive' : ''}
          />
          {errors.fromLocation && (
            <p className="text-sm text-destructive">{errors.fromLocation.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="toLocation" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-destructive" />
            Drop Location
          </Label>
          <Input
            id="toLocation"
            placeholder="e.g., Mumbai"
            {...register('toLocation')}
            className={errors.toLocation ? 'border-destructive' : ''}
          />
          {errors.toLocation && (
            <p className="text-sm text-destructive">{errors.toLocation.message}</p>
          )}
        </div>
      </div>

      {/* Weight and Rate */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-muted-foreground" />
            Weight (Tons)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="e.g., 20"
            {...register('weight', { valueAsNumber: true })}
            className={errors.weight ? 'border-destructive' : ''}
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ratePerTon" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            Rate per Ton (₹)
          </Label>
          <Input
            id="ratePerTon"
            type="number"
            placeholder="e.g., 2500"
            {...register('ratePerTon', { valueAsNumber: true })}
            className={errors.ratePerTon ? 'border-destructive' : ''}
          />
          {errors.ratePerTon && (
            <p className="text-sm text-destructive">{errors.ratePerTon.message}</p>
          )}
        </div>
      </div>

      {/* Auto-calculated Freight Amount */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Freight Amount (Auto-calculated)
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(freightAmount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {weight} tons × ₹{ratePerTon.toLocaleString('en-IN')}/ton
            </p>
          </div>
        </div>
      </div>

      {/* Client Advance */}
      <div className="space-y-2">
        <Label htmlFor="clientAdvance" className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
          Client Advance (Optional)
        </Label>
        <Input
          id="clientAdvance"
          type="number"
          placeholder="e.g., 5000"
          {...register('clientAdvance', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground">
          Advance amount received from client, if any
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 gradient-primary text-primary-foreground"
          disabled={isLoading || freightAmount === 0}
        >
          {isLoading ? 'Adding...' : 'Add Journey'}
        </Button>
      </div>
    </form>
  );
};
