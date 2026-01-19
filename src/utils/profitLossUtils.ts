import { Trip, Truck, mockTrips, mockTrucks } from './mockData';
import { TRIP_STATUS } from './constants';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear,
  parseISO,
  isWithinInterval,
  format,
  subMonths,
} from 'date-fns';

export type TimeFrame = 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom';
export type GroupBy = 'truck' | 'month' | 'overall';

export interface ExpenseBreakdown {
  diesel: number;
  toll: number;
  driverAdvance: number;
  other: number;
}

export interface ProfitLossEntry {
  id: string;
  label: string;
  tripCount: number;
  journeyCount: number;
  totalKm: number;
  income: number;
  expenses: ExpenseBreakdown;
  totalExpense: number;
  grossProfit: number;
  profitMargin: number;
  avgMileage: number;
}

export interface ProfitLossSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  overallMargin: number;
  totalTrips: number;
  totalJourneys: number;
  totalKm: number;
  avgMileage: number;
  expenseBreakdown: ExpenseBreakdown;
}

export interface ProfitLossReport {
  summary: ProfitLossSummary;
  entries: ProfitLossEntry[];
  timeFrame: { start: Date; end: Date; label: string };
}

export function getTimeFrameDates(timeFrame: TimeFrame, customStart?: Date, customEnd?: Date): { start: Date; end: Date; label: string } {
  const now = new Date();
  
  switch (timeFrame) {
    case 'this_month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, 'MMMM yyyy'),
      };
    case 'last_month':
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
        label: format(lastMonth, 'MMMM yyyy'),
      };
    case 'this_quarter':
      return {
        start: startOfQuarter(now),
        end: endOfQuarter(now),
        label: `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`,
      };
    case 'this_year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
        label: `FY ${now.getFullYear()}`,
      };
    case 'custom':
      if (customStart && customEnd) {
        return {
          start: customStart,
          end: customEnd,
          label: `${format(customStart, 'dd MMM')} - ${format(customEnd, 'dd MMM yyyy')}`,
        };
      }
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, 'MMMM yyyy'),
      };
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, 'MMMM yyyy'),
      };
  }
}

function filterTripsByDateRange(trips: Trip[], start: Date, end: Date): Trip[] {
  return trips.filter(trip => {
    // Use endDate for completed trips, startDate for running trips
    const tripDate = trip.endDate ? parseISO(trip.endDate) : parseISO(trip.startDate);
    return isWithinInterval(tripDate, { start, end });
  });
}

function calculateEntryFromTrips(trips: Trip[], id: string, label: string): ProfitLossEntry {
  const completedTrips = trips.filter(t => t.status === TRIP_STATUS.COMPLETED || t.status === TRIP_STATUS.LOCKED);
  
  const income = trips.reduce((sum, t) => sum + t.totalIncome, 0);
  const diesel = completedTrips.reduce((sum, t) => sum + (t.dieselAmount || 0), 0);
  const toll = completedTrips.reduce((sum, t) => sum + (t.tollExpense || 0), 0);
  const driverAdvance = trips.reduce((sum, t) => sum + t.driverAdvance, 0);
  const other = completedTrips.reduce((sum, t) => sum + (t.otherExpense || 0), 0);
  const totalExpense = diesel + toll + driverAdvance + other;
  const totalKm = completedTrips.reduce((sum, t) => sum + (t.totalKm || 0), 0);
  const totalDiesel = completedTrips.reduce((sum, t) => sum + (t.dieselQuantity || 0), 0);
  const journeyCount = trips.reduce((sum, t) => sum + t.journeys.length, 0);
  
  const grossProfit = income - totalExpense;
  const profitMargin = income > 0 ? (grossProfit / income) * 100 : 0;
  const avgMileage = totalDiesel > 0 ? totalKm / totalDiesel : 0;

  return {
    id,
    label,
    tripCount: trips.length,
    journeyCount,
    totalKm,
    income,
    expenses: { diesel, toll, driverAdvance, other },
    totalExpense,
    grossProfit,
    profitMargin,
    avgMileage,
  };
}

export function generateProfitLossReport(
  timeFrame: TimeFrame,
  groupBy: GroupBy,
  customStart?: Date,
  customEnd?: Date,
  trucks: Truck[] = mockTrucks,
  trips: Trip[] = mockTrips
): ProfitLossReport {
  const { start, end, label } = getTimeFrameDates(timeFrame, customStart, customEnd);
  const filteredTrips = filterTripsByDateRange(trips, start, end);
  
  let entries: ProfitLossEntry[] = [];

  if (groupBy === 'truck') {
    // Group by truck
    const truckMap = new Map<string, Trip[]>();
    filteredTrips.forEach(trip => {
      const existing = truckMap.get(trip.truckId) || [];
      existing.push(trip);
      truckMap.set(trip.truckId, existing);
    });

    entries = trucks.map(truck => {
      const truckTrips = truckMap.get(truck.id) || [];
      return calculateEntryFromTrips(truckTrips, truck.id, truck.registrationNumber);
    }).filter(entry => entry.tripCount > 0);
  } else if (groupBy === 'month') {
    // Group by month
    const monthMap = new Map<string, Trip[]>();
    filteredTrips.forEach(trip => {
      const tripDate = trip.endDate ? parseISO(trip.endDate) : parseISO(trip.startDate);
      const monthKey = format(tripDate, 'yyyy-MM');
      const existing = monthMap.get(monthKey) || [];
      existing.push(trip);
      monthMap.set(monthKey, existing);
    });

    const sortedMonths = Array.from(monthMap.keys()).sort();
    entries = sortedMonths.map(monthKey => {
      const monthTrips = monthMap.get(monthKey) || [];
      const monthDate = parseISO(`${monthKey}-01`);
      return calculateEntryFromTrips(monthTrips, monthKey, format(monthDate, 'MMMM yyyy'));
    });
  } else {
    // Overall summary as single entry
    entries = [calculateEntryFromTrips(filteredTrips, 'overall', 'Total')];
  }

  // Calculate summary
  const summary = calculateSummary(filteredTrips);

  return {
    summary,
    entries,
    timeFrame: { start, end, label },
  };
}

function calculateSummary(trips: Trip[]): ProfitLossSummary {
  const completedTrips = trips.filter(t => t.status === TRIP_STATUS.COMPLETED || t.status === TRIP_STATUS.LOCKED);
  
  const totalIncome = trips.reduce((sum, t) => sum + t.totalIncome, 0);
  const diesel = completedTrips.reduce((sum, t) => sum + (t.dieselAmount || 0), 0);
  const toll = completedTrips.reduce((sum, t) => sum + (t.tollExpense || 0), 0);
  const driverAdvance = trips.reduce((sum, t) => sum + t.driverAdvance, 0);
  const other = completedTrips.reduce((sum, t) => sum + (t.otherExpense || 0), 0);
  const totalExpenses = diesel + toll + driverAdvance + other;
  const totalKm = completedTrips.reduce((sum, t) => sum + (t.totalKm || 0), 0);
  const totalDiesel = completedTrips.reduce((sum, t) => sum + (t.dieselQuantity || 0), 0);
  const totalJourneys = trips.reduce((sum, t) => sum + t.journeys.length, 0);
  
  const netProfit = totalIncome - totalExpenses;
  const overallMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const avgMileage = totalDiesel > 0 ? totalKm / totalDiesel : 0;

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    overallMargin,
    totalTrips: trips.length,
    totalJourneys,
    totalKm,
    avgMileage,
    expenseBreakdown: { diesel, toll, driverAdvance, other },
  };
}

export function getExpensePercentages(breakdown: ExpenseBreakdown): Record<keyof ExpenseBreakdown, number> {
  const total = breakdown.diesel + breakdown.toll + breakdown.driverAdvance + breakdown.other;
  if (total === 0) return { diesel: 0, toll: 0, driverAdvance: 0, other: 0 };
  
  return {
    diesel: (breakdown.diesel / total) * 100,
    toll: (breakdown.toll / total) * 100,
    driverAdvance: (breakdown.driverAdvance / total) * 100,
    other: (breakdown.other / total) * 100,
  };
}
