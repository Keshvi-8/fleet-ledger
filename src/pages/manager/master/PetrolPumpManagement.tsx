import React, { useState } from 'react';
import { mockPetrolPumps, PetrolPump } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Fuel, Edit, Trash2, MapPin } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export const PetrolPumpManagement: React.FC = () => {
  const [pumps, setPumps] = useState(mockPetrolPumps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPumps = pumps.filter(
    (pump) =>
      pump.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPump: PetrolPump = {
      id: String(pumps.length + 1),
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      dieselRate: Number(formData.get('rate')),
    };

    setPumps([...pumps, newPump]);
    setIsDialogOpen(false);
    toast.success('Petrol pump added successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Petrol Pump Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage {pumps.length} registered fuel stations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-accent text-accent-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Petrol Pump
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Petrol Pump</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPump} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pump Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="HP Fuel Station"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Pune Highway"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Diesel Rate (₹/L)</Label>
                <Input
                  id="rate"
                  name="rate"
                  type="number"
                  step="0.01"
                  placeholder="89.50"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gradient-accent text-accent-foreground">
                  Add Pump
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search pumps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Pumps Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPumps.map((pump, index) => (
          <div
            key={pump.id}
            className="rounded-xl bg-card p-5 shadow-card animate-slide-up hover:shadow-card-hover transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-warning">
                <Fuel className="h-6 w-6 text-warning-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">
                  {pump.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {pump.location}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Diesel Rate</span>
                <span className="text-lg font-bold text-card-foreground">
                  ₹{pump.dieselRate.toFixed(2)}/L
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
