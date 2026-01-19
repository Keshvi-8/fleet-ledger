import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ProfitLossSummary } from '@/utils/profitLossUtils';
import { 
  TrendingUp, 
  TrendingDown, 
  Banknote, 
  Receipt, 
  Percent,
  Truck,
  MapPin,
  Fuel
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfitLossSummaryCardsProps {
  summary: ProfitLossSummary;
}

export function ProfitLossSummaryCards({ summary }: ProfitLossSummaryCardsProps) {
  const isProfit = summary.netProfit >= 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Income */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Total Income</span>
          </div>
          <p className="text-xl font-bold text-emerald-600">
            {formatCurrency(summary.totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalJourneys} journeys
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border-rose-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-rose-500/20">
              <TrendingDown className="h-4 w-4 text-rose-600" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Total Expenses</span>
          </div>
          <p className="text-xl font-bold text-rose-600">
            {formatCurrency(summary.totalExpenses)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalTrips} trips
          </p>
        </CardContent>
      </Card>

      {/* Net Profit */}
      <Card className={cn(
        "bg-gradient-to-br border",
        isProfit 
          ? "from-blue-500/10 to-blue-600/5 border-blue-500/20" 
          : "from-orange-500/10 to-orange-600/5 border-orange-500/20"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "p-2 rounded-lg",
              isProfit ? "bg-blue-500/20" : "bg-orange-500/20"
            )}>
              <Banknote className={cn(
                "h-4 w-4",
                isProfit ? "text-blue-600" : "text-orange-600"
              )} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Net Profit</span>
          </div>
          <p className={cn(
            "text-xl font-bold",
            isProfit ? "text-blue-600" : "text-orange-600"
          )}>
            {formatCurrency(summary.netProfit)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.overallMargin.toFixed(1)}% margin
          </p>
        </CardContent>
      </Card>

      {/* Efficiency Stats */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Fuel className="h-4 w-4 text-violet-600" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Avg Mileage</span>
          </div>
          <p className="text-xl font-bold text-violet-600">
            {summary.avgMileage.toFixed(2)} km/L
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalKm.toLocaleString()} km total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
