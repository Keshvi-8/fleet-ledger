import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TruckExpenseData } from '@/utils/expenseReportUtils';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseByTruckTableProps {
  truckData: TruckExpenseData[];
}

export function ExpenseByTruckTable({ truckData }: ExpenseByTruckTableProps) {
  const sortedData = [...truckData].sort((a, b) => b.total - a.total);
  
  const totals = sortedData.reduce(
    (acc, truck) => ({
      diesel: acc.diesel + truck.diesel,
      toll: acc.toll + truck.toll,
      driverAdvance: acc.driverAdvance + truck.driverAdvance,
      other: acc.other + truck.other,
      total: acc.total + truck.total,
      trips: acc.trips + truck.tripCount,
      km: acc.km + truck.totalKm,
    }),
    { diesel: 0, toll: 0, driverAdvance: 0, other: 0, total: 0, trips: 0, km: 0 }
  );

  const getCostPerKmBadge = (costPerKm: number) => {
    if (costPerKm === 0) return null;
    if (costPerKm < 25) return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Low</Badge>;
    if (costPerKm < 35) return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Medium</Badge>;
    return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">High</Badge>;
  };

  if (sortedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expense by Truck</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No truck expense data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expense by Truck</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Truck</TableHead>
                <TableHead className="text-right">Trips</TableHead>
                <TableHead className="text-right">Diesel</TableHead>
                <TableHead className="text-right">Toll</TableHead>
                <TableHead className="text-right">Driver Adv.</TableHead>
                <TableHead className="text-right">Other</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">₹/KM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((truck) => (
                <TableRow key={truck.truckId}>
                  <TableCell className="font-medium">{truck.truckNumber}</TableCell>
                  <TableCell className="text-right">{truck.tripCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(truck.diesel)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(truck.toll)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(truck.driverAdvance)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(truck.other)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(truck.total)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>₹{truck.costPerKm.toFixed(2)}</span>
                      {getCostPerKmBadge(truck.costPerKm)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="border-t-2 bg-muted/50 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totals.trips}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.diesel)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.toll)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.driverAdvance)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.other)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totals.total)}</TableCell>
                <TableCell className="text-right">
                  ₹{(totals.km > 0 ? totals.total / totals.km : 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
