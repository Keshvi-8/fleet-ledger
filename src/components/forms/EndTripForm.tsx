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
import { mockPetrolPumps, Trip, PetrolPump } from '@/utils/mockData';
import { formatCurrency } from '@/utils/formatters';
import {
  Fuel,
  MapPin,
  Gauge,
  Calculator,
  Receipt,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const endTripSchema = z.object({
  totalKm: z.number().min(1, 'Total KM is required').max(50000, 'KM cannot exceed 50,000'),
  petrolPumpId: z.string().min(1, 'Petrol pump is required'),
  dieselQuantity: z.number().min(1, 'Diesel quantity is required').max(5000, 'Cannot exceed 5000 litres'),
  tollExpense: z.number().min(0).max(100000).optional(),
  otherExpense: z.number().min(0).max(500000).optional(),
  otherExpenseNote: z.string().max(200).optional(),
});

type EndTripFormData = z.infer<typeof endTripSchema>;

interface EndTripFormProps {
  trip: Trip;
  onSubmit: (data: EndTripFormData & { 
    dieselAmount: number; 
    totalExpense: number; 
    profit: number;
    mileage: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EndTripForm: React.FC<EndTripFormProps> = ({
  trip,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedPump, setSelectedPump] = useState<PetrolPump | null>(null);
  const [calculations, setCalculations] = useState({
    dieselAmount: 0,
    totalExpense: 0,
    profit: 0,
    mileage: 0,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EndTripFormData>({
    resolver: zodResolver(endTripSchema),
    defaultValues: {
      tollExpense: 0,
      otherExpense: 0,
    },
  });

  const watchedKm = watch('totalKm');
  const watchedDiesel = watch('dieselQuantity');
  const watchedToll = watch('tollExpense');
  const watchedOther = watch('otherExpense');

  // Calculate totals
  useEffect(() => {
    const km = Number(watchedKm) || 0;
    const diesel = Number(watchedDiesel) || 0;
    const toll = Number(watchedToll) || 0;
    const other = Number(watchedOther) || 0;
    const dieselRate = selectedPump?.dieselRate || 0;

    const dieselAmount = diesel * dieselRate;
    const totalExpense = dieselAmount + toll + other + trip.driverAdvance;
    const profit = trip.totalIncome - totalExpense;
    const mileage = diesel > 0 ? km / diesel : 0;

    setCalculations({
      dieselAmount,
      totalExpense,
      profit,
      mileage: Math.round(mileage * 100) / 100,
    });
  }, [watchedKm, watchedDiesel, watchedToll, watchedOther, selectedPump, trip]);

  const handlePumpChange = (pumpId: string) => {
    const pump = mockPetrolPumps.find(p => p.id === pumpId);
    setSelectedPump(pump || null);
    setValue('petrolPumpId', pumpId);
  };

  const onFormSubmit = (data: EndTripFormData) => {
    onSubmit({
      ...data,
      ...calculations,
    });
  };

  const totalIncome = trip.totalIncome;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Income Summary */}
      <div className="p-4 bg-success/10 rounded-xl border border-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="font-medium text-card-foreground">Total Trip Income</span>
          </div>
          <span className="text-xl font-bold text-success">{formatCurrency(totalIncome)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          From {trip.journeys.length} journey{trip.journeys.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Total KM */}
      <div className="space-y-2">
        <Label htmlFor="totalKm" className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          Total Kilometers Driven
        </Label>
        <Input
          id="totalKm"
          type="number"
          placeholder="e.g., 850"
          {...register('totalKm', { valueAsNumber: true })}
          className={errors.totalKm ? 'border-destructive' : ''}
        />
        {errors.totalKm && (
          <p className="text-sm text-destructive">{errors.totalKm.message}</p>
        )}
      </div>

      {/* Petrol Pump Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-muted-foreground" />
          Select Petrol Pump
        </Label>
        <Select onValueChange={handlePumpChange}>
          <SelectTrigger className={errors.petrolPumpId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Choose petrol pump" />
          </SelectTrigger>
          <SelectContent>
            {mockPetrolPumps.map((pump) => (
              <SelectItem key={pump.id} value={pump.id}>
                <div className="flex items-center justify-between gap-4">
                  <span>{pump.name}</span>
                  <span className="text-xs text-muted-foreground">₹{pump.dieselRate}/L</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.petrolPumpId && (
          <p className="text-sm text-destructive">{errors.petrolPumpId.message}</p>
        )}
        {selectedPump && (
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{selectedPump.location}</span>
              <span className="font-medium text-primary">₹{selectedPump.dieselRate}/litre</span>
            </div>
          </div>
        )}
      </div>

      {/* Diesel Quantity */}
      <div className="space-y-2">
        <Label htmlFor="dieselQuantity" className="flex items-center gap-2">
          <Fuel className="h-4 w-4 text-muted-foreground" />
          Diesel Quantity (Litres)
        </Label>
        <Input
          id="dieselQuantity"
          type="number"
          step="0.1"
          placeholder="e.g., 180"
          {...register('dieselQuantity', { valueAsNumber: true })}
          className={errors.dieselQuantity ? 'border-destructive' : ''}
        />
        {errors.dieselQuantity && (
          <p className="text-sm text-destructive">{errors.dieselQuantity.message}</p>
        )}
      </div>

      {/* Diesel Amount (Auto-calculated) */}
      {selectedPump && calculations.dieselAmount > 0 && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Diesel Amount</span>
            <div className="text-right">
              <p className="font-semibold text-primary">{formatCurrency(calculations.dieselAmount)}</p>
              <p className="text-xs text-muted-foreground">
                {watchedDiesel}L × ₹{selectedPump.dieselRate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toll & Other Expenses */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tollExpense" className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Toll Expenses (₹)
          </Label>
          <Input
            id="tollExpense"
            type="number"
            placeholder="e.g., 2500"
            {...register('tollExpense', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherExpense" className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Other Expenses (₹)
          </Label>
          <Input
            id="otherExpense"
            type="number"
            placeholder="e.g., 1200"
            {...register('otherExpense', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Other Expense Note */}
      <div className="space-y-2">
        <Label htmlFor="otherExpenseNote">Other Expense Details (Optional)</Label>
        <Input
          id="otherExpenseNote"
          placeholder="e.g., Repairs, food, parking..."
          {...register('otherExpenseNote')}
        />
      </div>

      {/* Driver Advance Info */}
      <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Driver Advance (Already given)</span>
        <span className="font-medium text-card-foreground">{formatCurrency(trip.driverAdvance)}</span>
      </div>

      {/* Calculation Summary */}
      <div className="p-4 bg-gradient-to-br from-card to-muted/30 rounded-xl border border-border space-y-3">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Trip Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Income</span>
            <span className="font-medium text-success">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Diesel ({watchedDiesel || 0}L)</span>
            <span className="text-destructive">-{formatCurrency(calculations.dieselAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toll Expenses</span>
            <span className="text-destructive">-{formatCurrency(watchedToll || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Other Expenses</span>
            <span className="text-destructive">-{formatCurrency(watchedOther || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Driver Advance</span>
            <span className="text-destructive">-{formatCurrency(trip.driverAdvance)}</span>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="font-medium text-destructive">{formatCurrency(calculations.totalExpense)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-card-foreground flex items-center gap-2">
                {calculations.profit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                Net Profit/Loss
              </span>
              <span className={cn(
                'text-xl font-bold',
                calculations.profit >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {formatCurrency(calculations.profit)}
              </span>
            </div>
          </div>

          {calculations.mileage > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Mileage
                </span>
                <span className={cn(
                  'font-medium',
                  calculations.mileage >= 4 ? 'text-success' : 'text-warning'
                )}>
                  {calculations.mileage} km/L
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning for Loss */}
      {calculations.profit < 0 && calculations.totalExpense > 0 && (
        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Trip is at a loss</p>
            <p className="text-sm text-muted-foreground">
              Expenses exceed income by {formatCurrency(Math.abs(calculations.profit))}
            </p>
          </div>
        </div>
      )}

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
          disabled={isLoading || !selectedPump}
        >
          {isLoading ? 'Completing...' : 'Complete Trip'}
        </Button>
      </div>
    </form>
  );
};
