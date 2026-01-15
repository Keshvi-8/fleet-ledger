import React, { useState } from 'react';
import { mockTrucks, Truck } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/common/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Truck as TruckIcon, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const TruckManagement: React.FC = () => {
  const [trucks, setTrucks] = useState(mockTrucks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrucks = trucks.filter(
    (truck) =>
      truck.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTruck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTruck: Truck = {
      id: String(trucks.length + 1),
      registrationNumber: formData.get('registration') as string,
      model: formData.get('model') as string,
      capacity: Number(formData.get('capacity')),
      status: 'available',
    };

    setTrucks([...trucks, newTruck]);
    setIsDialogOpen(false);
    toast.success('Truck added successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Truck Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your fleet of {trucks.length} trucks
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-accent text-accent-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Truck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Truck</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTruck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registration">Registration Number</Label>
                <Input
                  id="registration"
                  name="registration"
                  placeholder="MH12AB1234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Tata Prima"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (tons)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="25"
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
                  Add Truck
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
          placeholder="Search trucks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Trucks Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTrucks.map((truck, index) => (
          <div
            key={truck.id}
            className="rounded-xl bg-card p-5 shadow-card animate-slide-up hover:shadow-card-hover transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TruckIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {truck.registrationNumber}
                  </h3>
                  <p className="text-sm text-muted-foreground">{truck.model}</p>
                </div>
              </div>
              <Badge
                variant={
                  truck.status === 'available'
                    ? 'success'
                    : truck.status === 'on_trip'
                    ? 'default'
                    : 'warning'
                }
              >
                {truck.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium text-card-foreground">{truck.capacity} tons</span>
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
