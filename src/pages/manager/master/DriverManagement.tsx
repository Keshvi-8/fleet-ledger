import React, { useState } from 'react';
import { mockDrivers, Driver } from '@/utils/mockData';
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
import { Plus, Search, User, Edit, Trash2, Phone, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery)
  );

  const handleAddDriver = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDriver: Driver = {
      id: String(drivers.length + 1),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      licenseNumber: formData.get('license') as string,
      salary: Number(formData.get('salary')),
    };

    setDrivers([...drivers, newDriver]);
    setIsDialogOpen(false);
    toast.success('Driver added successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Driver Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your team of {drivers.length} drivers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-accent text-accent-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter driver name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  name="license"
                  placeholder="MH1220210001234"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="35000"
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
                  Add Driver
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
          placeholder="Search drivers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver, index) => (
          <div
            key={driver.id}
            className="rounded-xl bg-card p-5 shadow-card animate-slide-up hover:shadow-card-hover transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-primary-foreground font-semibold text-lg">
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {driver.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {driver.phone}
                  </div>
                </div>
              </div>
              <Badge variant={driver.assignedTruckId ? 'default' : 'success'}>
                {driver.assignedTruckId ? 'Assigned' : 'Available'}
              </Badge>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" />
                  License
                </span>
                <span className="font-medium text-card-foreground">{driver.licenseNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Salary</span>
                <span className="font-medium text-success">{formatCurrency(driver.salary)}/mo</span>
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
