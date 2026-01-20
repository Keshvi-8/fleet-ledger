import { Trip, mockTrips, mockTrucks, Truck } from './mockData';
import { TRIP_STATUS } from './constants';
import { 
  startOfMonth,
  endOfMonth,
  parseISO,
  isWithinInterval,
  format,
  eachMonthOfInterval,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subMonths,
} from 'date-fns';
import { TimeFrame, getTimeFrameDates, ExpenseBreakdown } from './profitLossUtils';

export type ExpenseCategory = 'diesel' | 'toll' | 'driverAdvance' | 'other';

export interface CategoryExpenseData {
  category: ExpenseCategory;
  label: string;
  amount: number;
  percentage: number;
  tripCount: number;
  avgPerTrip: number;
  color: string;
}

export interface MonthlyExpenseTrend {
  month: string;
  monthLabel: string;
  diesel: number;
  toll: number;
  driverAdvance: number;
  other: number;
  total: number;
}

export interface TruckExpenseData {
  truckId: string;
  truckNumber: string;
  diesel: number;
  toll: number;
  driverAdvance: number;
  other: number;
  total: number;
  tripCount: number;
  totalKm: number;
  costPerKm: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  breakdown: ExpenseBreakdown;
  categoryData: CategoryExpenseData[];
  highestCategory: string;
  lowestCategory: string;
  avgExpensePerTrip: number;
  avgCostPerKm: number;
  totalTrips: number;
  totalKm: number;
}

export interface PeriodComparison {
  currentPeriod: ExpenseSummary;
  previousPeriod: ExpenseSummary;
  percentageChange: {
    total: number;
    diesel: number;
    toll: number;
    driverAdvance: number;
    other: number;
  };
  trend: 'up' | 'down' | 'stable';
}

export interface ExpenseReport {
  summary: ExpenseSummary;
  trends: MonthlyExpenseTrend[];
  byTruck: TruckExpenseData[];
  comparison: PeriodComparison;
  timeFrame: { start: Date; end: Date; label: string };
}

const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; color: string }> = {
  diesel: { label: 'Diesel', color: 'hsl(0, 84%, 60%)' },
  toll: { label: 'Toll', color: 'hsl(38, 92%, 50%)' },
  driverAdvance: { label: 'Driver Advance', color: 'hsl(217, 91%, 60%)' },
  other: { label: 'Other', color: 'hsl(262, 83%, 58%)' },
};

export function getCategoryConfig() {
  return CATEGORY_CONFIG;
}

function filterTripsByDateRange(trips: Trip[], start: Date, end: Date): Trip[] {
  return trips.filter(trip => {
    const tripDate = trip.endDate ? parseISO(trip.endDate) : parseISO(trip.startDate);
    return isWithinInterval(tripDate, { start, end });
  });
}

function calculateExpenseSummary(trips: Trip[]): ExpenseSummary {
  const completedTrips = trips.filter(t => t.status === TRIP_STATUS.COMPLETED || t.status === TRIP_STATUS.LOCKED);
  
  const diesel = completedTrips.reduce((sum, t) => sum + (t.dieselAmount || 0), 0);
  const toll = completedTrips.reduce((sum, t) => sum + (t.tollExpense || 0), 0);
  const driverAdvance = trips.reduce((sum, t) => sum + t.driverAdvance, 0);
  const other = completedTrips.reduce((sum, t) => sum + (t.otherExpense || 0), 0);
  const totalExpenses = diesel + toll + driverAdvance + other;
  const totalKm = completedTrips.reduce((sum, t) => sum + (t.totalKm || 0), 0);

  const breakdown: ExpenseBreakdown = { diesel, toll, driverAdvance, other };

  // Calculate category data
  const categoryData: CategoryExpenseData[] = (Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map(category => {
    const amount = breakdown[category];
    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
    const tripCount = category === 'driverAdvance' ? trips.length : completedTrips.length;
    const avgPerTrip = tripCount > 0 ? amount / tripCount : 0;

    return {
      category,
      label: CATEGORY_CONFIG[category].label,
      amount,
      percentage,
      tripCount,
      avgPerTrip,
      color: CATEGORY_CONFIG[category].color,
    };
  });

  // Sort to find highest and lowest
  const sortedCategories = [...categoryData].sort((a, b) => b.amount - a.amount);
  const highestCategory = sortedCategories[0]?.label || 'N/A';
  const lowestCategory = sortedCategories.filter(c => c.amount > 0).pop()?.label || 'N/A';

  const avgExpensePerTrip = trips.length > 0 ? totalExpenses / trips.length : 0;
  const avgCostPerKm = totalKm > 0 ? totalExpenses / totalKm : 0;

  return {
    totalExpenses,
    breakdown,
    categoryData,
    highestCategory,
    lowestCategory,
    avgExpensePerTrip,
    avgCostPerKm,
    totalTrips: trips.length,
    totalKm,
  };
}

function calculateMonthlyTrends(trips: Trip[], start: Date, end: Date): MonthlyExpenseTrend[] {
  const months = eachMonthOfInterval({ start, end });
  
  return months.map(monthStart => {
    const monthEnd = endOfMonth(monthStart);
    const monthTrips = filterTripsByDateRange(trips, monthStart, monthEnd);
    const completedTrips = monthTrips.filter(t => t.status === TRIP_STATUS.COMPLETED || t.status === TRIP_STATUS.LOCKED);

    const diesel = completedTrips.reduce((sum, t) => sum + (t.dieselAmount || 0), 0);
    const toll = completedTrips.reduce((sum, t) => sum + (t.tollExpense || 0), 0);
    const driverAdvance = monthTrips.reduce((sum, t) => sum + t.driverAdvance, 0);
    const other = completedTrips.reduce((sum, t) => sum + (t.otherExpense || 0), 0);

    return {
      month: format(monthStart, 'yyyy-MM'),
      monthLabel: format(monthStart, 'MMM yyyy'),
      diesel,
      toll,
      driverAdvance,
      other,
      total: diesel + toll + driverAdvance + other,
    };
  });
}

function calculateTruckExpenses(trips: Trip[], trucks: Truck[]): TruckExpenseData[] {
  const truckMap = new Map<string, Trip[]>();
  
  trips.forEach(trip => {
    const existing = truckMap.get(trip.truckId) || [];
    existing.push(trip);
    truckMap.set(trip.truckId, existing);
  });

  return trucks.map(truck => {
    const truckTrips = truckMap.get(truck.id) || [];
    const completedTrips = truckTrips.filter(t => t.status === TRIP_STATUS.COMPLETED || t.status === TRIP_STATUS.LOCKED);

    const diesel = completedTrips.reduce((sum, t) => sum + (t.dieselAmount || 0), 0);
    const toll = completedTrips.reduce((sum, t) => sum + (t.tollExpense || 0), 0);
    const driverAdvance = truckTrips.reduce((sum, t) => sum + t.driverAdvance, 0);
    const other = completedTrips.reduce((sum, t) => sum + (t.otherExpense || 0), 0);
    const total = diesel + toll + driverAdvance + other;
    const totalKm = completedTrips.reduce((sum, t) => sum + (t.totalKm || 0), 0);
    const costPerKm = totalKm > 0 ? total / totalKm : 0;

    return {
      truckId: truck.id,
      truckNumber: truck.registrationNumber,
      diesel,
      toll,
      driverAdvance,
      other,
      total,
      tripCount: truckTrips.length,
      totalKm,
      costPerKm,
    };
  }).filter(t => t.tripCount > 0);
}

function getPreviousPeriodDates(timeFrame: TimeFrame, start: Date, end: Date): { start: Date; end: Date } {
  const periodLength = end.getTime() - start.getTime();
  
  switch (timeFrame) {
    case 'this_month':
      const lastMonth = subMonths(start, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    case 'last_month':
      const twoMonthsAgo = subMonths(start, 1);
      return { start: startOfMonth(twoMonthsAgo), end: endOfMonth(twoMonthsAgo) };
    case 'this_quarter':
      const prevQuarterStart = subMonths(start, 3);
      return { start: startOfQuarter(prevQuarterStart), end: endOfQuarter(prevQuarterStart) };
    case 'this_year':
      const prevYearStart = subMonths(start, 12);
      return { start: startOfYear(prevYearStart), end: endOfYear(prevYearStart) };
    default:
      return { 
        start: new Date(start.getTime() - periodLength), 
        end: new Date(end.getTime() - periodLength) 
      };
  }
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function calculateComparison(
  trips: Trip[],
  timeFrame: TimeFrame,
  start: Date,
  end: Date
): PeriodComparison {
  const currentTrips = filterTripsByDateRange(trips, start, end);
  const currentSummary = calculateExpenseSummary(currentTrips);

  const prevDates = getPreviousPeriodDates(timeFrame, start, end);
  const previousTrips = filterTripsByDateRange(trips, prevDates.start, prevDates.end);
  const previousSummary = calculateExpenseSummary(previousTrips);

  const percentageChange = {
    total: calculatePercentageChange(currentSummary.totalExpenses, previousSummary.totalExpenses),
    diesel: calculatePercentageChange(currentSummary.breakdown.diesel, previousSummary.breakdown.diesel),
    toll: calculatePercentageChange(currentSummary.breakdown.toll, previousSummary.breakdown.toll),
    driverAdvance: calculatePercentageChange(currentSummary.breakdown.driverAdvance, previousSummary.breakdown.driverAdvance),
    other: calculatePercentageChange(currentSummary.breakdown.other, previousSummary.breakdown.other),
  };

  const trend: 'up' | 'down' | 'stable' = 
    percentageChange.total > 5 ? 'up' : 
    percentageChange.total < -5 ? 'down' : 'stable';

  return {
    currentPeriod: currentSummary,
    previousPeriod: previousSummary,
    percentageChange,
    trend,
  };
}

export function generateExpenseReport(
  timeFrame: TimeFrame,
  customStart?: Date,
  customEnd?: Date,
  trucks: Truck[] = mockTrucks,
  trips: Trip[] = mockTrips
): ExpenseReport {
  const { start, end, label } = getTimeFrameDates(timeFrame, customStart, customEnd);
  const filteredTrips = filterTripsByDateRange(trips, start, end);

  const summary = calculateExpenseSummary(filteredTrips);
  const trends = calculateMonthlyTrends(trips, start, end);
  const byTruck = calculateTruckExpenses(filteredTrips, trucks);
  const comparison = calculateComparison(trips, timeFrame, start, end);

  return {
    summary,
    trends,
    byTruck,
    comparison,
    timeFrame: { start, end, label },
  };
}

export function formatExpenseValue(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
}
