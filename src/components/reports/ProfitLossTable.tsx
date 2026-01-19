import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { ProfitLossEntry } from '@/utils/profitLossUtils';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProfitLossTableProps {
  entries: ProfitLossEntry[];
  groupByLabel: string;
}

export function ProfitLossTable({ entries, groupByLabel }: ProfitLossTableProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No data available for the selected period
        </CardContent>
      </Card>
    );
  }

  const getMarginBadge = (margin: number) => {
    if (margin >= 40) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
          <TrendingUp className="h-3 w-3 mr-1" />
          {margin.toFixed(1)}%
        </Badge>
      );
    } else if (margin >= 20) {
      return (
        <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">
          <Minus className="h-3 w-3 mr-1" />
          {margin.toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-rose-500/20 text-rose-700 border-rose-500/30">
          <TrendingDown className="h-3 w-3 mr-1" />
          {margin.toFixed(1)}%
        </Badge>
      );
    }
  };

  // Calculate totals
  const totals = entries.reduce(
    (acc, entry) => ({
      tripCount: acc.tripCount + entry.tripCount,
      journeyCount: acc.journeyCount + entry.journeyCount,
      income: acc.income + entry.income,
      totalExpense: acc.totalExpense + entry.totalExpense,
      grossProfit: acc.grossProfit + entry.grossProfit,
      totalKm: acc.totalKm + entry.totalKm,
    }),
    { tripCount: 0, journeyCount: 0, income: 0, totalExpense: 0, grossProfit: 0, totalKm: 0 }
  );

  const totalMargin = totals.income > 0 ? (totals.grossProfit / totals.income) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">P&L by {groupByLabel}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">{groupByLabel}</TableHead>
                <TableHead className="text-center font-semibold">Trips</TableHead>
                <TableHead className="text-center font-semibold">Journeys</TableHead>
                <TableHead className="text-right font-semibold">Income</TableHead>
                <TableHead className="text-right font-semibold">Expenses</TableHead>
                <TableHead className="text-right font-semibold">Profit</TableHead>
                <TableHead className="text-center font-semibold">Margin</TableHead>
                <TableHead className="text-right font-semibold">Km</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{entry.label}</TableCell>
                  <TableCell className="text-center">{entry.tripCount}</TableCell>
                  <TableCell className="text-center">{entry.journeyCount}</TableCell>
                  <TableCell className="text-right text-emerald-600 font-medium">
                    {formatCurrency(entry.income)}
                  </TableCell>
                  <TableCell className="text-right text-rose-600">
                    {formatCurrency(entry.totalExpense)}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-semibold",
                    entry.grossProfit >= 0 ? "text-blue-600" : "text-orange-600"
                  )}>
                    {formatCurrency(entry.grossProfit)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getMarginBadge(entry.profitMargin)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {entry.totalKm.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Totals Row */}
              <TableRow className="bg-muted/50 font-semibold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-center">{totals.tripCount}</TableCell>
                <TableCell className="text-center">{totals.journeyCount}</TableCell>
                <TableCell className="text-right text-emerald-600">
                  {formatCurrency(totals.income)}
                </TableCell>
                <TableCell className="text-right text-rose-600">
                  {formatCurrency(totals.totalExpense)}
                </TableCell>
                <TableCell className={cn(
                  "text-right",
                  totals.grossProfit >= 0 ? "text-blue-600" : "text-orange-600"
                )}>
                  {formatCurrency(totals.grossProfit)}
                </TableCell>
                <TableCell className="text-center">
                  {getMarginBadge(totalMargin)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {totals.totalKm.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
