import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, Fuel, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { DriverExpenseData } from '@/utils/expenseReportUtils';
import { formatCurrency } from '@/utils/formatters';

interface DriverExpenseBreakdownProps {
  driverData: DriverExpenseData[];
}

export function DriverExpenseBreakdown({ driverData }: DriverExpenseBreakdownProps) {
  // Sort by mileage (highest first = most efficient)
  const sortedDrivers = [...driverData].sort((a, b) => b.avgMileage - a.avgMileage);
  
  const getEfficiencyBadge = (mileage: number, rank: number) => {
    if (rank === 0) {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
          <Award className="h-3 w-3" />
          Best
        </Badge>
      );
    }
    if (mileage >= 4) {
      return (
        <Badge variant="outline" className="bg-accent text-accent-foreground">
          Excellent
        </Badge>
      );
    }
    if (mileage >= 3.5) {
      return (
        <Badge variant="outline" className="bg-secondary text-secondary-foreground">
          Good
        </Badge>
      );
    }
    if (mileage >= 3) {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Average
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        Below Avg
      </Badge>
    );
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="h-4 w-4 text-primary" />;
    }
    if (trend < 0) {
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    }
    return null;
  };

  if (driverData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Driver Fuel Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No driver data available for the selected period
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate averages for comparison
  const avgMileage = driverData.reduce((sum, d) => sum + d.avgMileage, 0) / driverData.length;
  const avgCostPerKm = driverData.reduce((sum, d) => sum + d.costPerKm, 0) / driverData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Driver Fuel Efficiency Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare driver performance by mileage and cost efficiency
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{driverData.length}</p>
            <p className="text-xs text-muted-foreground">Drivers</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{avgMileage.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Avg Mileage (km/L)</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{sortedDrivers[0]?.avgMileage.toFixed(2) || '-'}</p>
            <p className="text-xs text-muted-foreground">Best Mileage</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">₹{avgCostPerKm.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg ₹/KM</p>
          </div>
        </div>

        {/* Driver Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">Trips</TableHead>
                <TableHead className="text-right">Total KM</TableHead>
                <TableHead className="text-right">Diesel (L)</TableHead>
                <TableHead className="text-right">Diesel Cost</TableHead>
                <TableHead className="text-right">Mileage</TableHead>
                <TableHead className="text-right">₹/KM</TableHead>
                <TableHead className="text-center">Efficiency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDrivers.map((driver, index) => (
                <TableRow key={driver.driverId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{driver.driverName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(driver.totalExpenses)} total expenses
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{driver.tripCount}</TableCell>
                  <TableCell className="text-right">{driver.totalKm.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{driver.totalDieselQty.toFixed(0)} L</TableCell>
                  <TableCell className="text-right">{formatCurrency(driver.dieselCost)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-medium">{driver.avgMileage.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">km/L</span>
                      {getTrendIcon(driver.avgMileage - avgMileage)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={driver.costPerKm > avgCostPerKm ? 'text-destructive' : 'text-primary'}>
                      ₹{driver.costPerKm.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getEfficiencyBadge(driver.avgMileage, index)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-accent/50 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Performance Insights
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {sortedDrivers.length > 0 && (
              <li>
                🏆 <strong>{sortedDrivers[0].driverName}</strong> achieves the best fuel efficiency 
                at {sortedDrivers[0].avgMileage.toFixed(2)} km/L
              </li>
            )}
            {sortedDrivers.length > 1 && sortedDrivers[0].avgMileage - sortedDrivers[sortedDrivers.length - 1].avgMileage > 0.5 && (
              <li>
                📊 Mileage varies by {(sortedDrivers[0].avgMileage - sortedDrivers[sortedDrivers.length - 1].avgMileage).toFixed(2)} km/L 
                between best and lowest performers
              </li>
            )}
            {avgMileage > 0 && (
              <li>
                ⛽ Fleet average is {avgMileage.toFixed(2)} km/L with avg cost of ₹{avgCostPerKm.toFixed(1)}/km
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
