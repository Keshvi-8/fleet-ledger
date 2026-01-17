import { Trip, Journey, Client } from './mockData';
import { BILL_STATUS } from './constants';
import { Payment } from './paymentUtils';

export interface BillLineItem {
  journeyId: string;
  tripId: string;
  truckNumber: string;
  fromLocation: string;
  toLocation: string;
  weight: number;
  ratePerTon: number;
  freightAmount: number;
  clientAdvance: number;
  date: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  clientId: string;
  clientName: string;
  clientGst: string;
  clientAddress: string;
  clientWhatsapp: string;
  billingPeriod: {
    startDate: string;
    endDate: string;
    label: string;
  };
  lineItems: BillLineItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  totalAdvance: number;
  grandTotal: number;
  netPayable: number;
  status: typeof BILL_STATUS[keyof typeof BILL_STATUS];
  generatedAt: string;
  sentAt?: string;
  paidAt?: string;
  payments: Payment[];
}

export interface BillingPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
  billGenerationDate: Date;
  paymentWindowStart: Date;
  paymentWindowEnd: Date;
}

// GST rate (18% total - 9% CGST + 9% SGST for intra-state, or 18% IGST for inter-state)
export const GST_RATE = 0.18;
export const CGST_RATE = 0.09;
export const SGST_RATE = 0.09;

/**
 * Get billing periods based on a reference date
 * Period 1: 1st - 15th (Bill generated on 15th, payment window 20th-25th)
 * Period 2: 16th - End of month (Bill generated on 30th/31st, payment window 1st-5th next month)
 */
export function getBillingPeriods(referenceDate: Date = new Date()): BillingPeriod[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  
  const periods: BillingPeriod[] = [];
  
  // First half period: 1st - 15th
  const firstHalfStart = new Date(year, month, 1);
  const firstHalfEnd = new Date(year, month, 15);
  const firstHalfBillDate = new Date(year, month, 15);
  const firstHalfPaymentStart = new Date(year, month, 20);
  const firstHalfPaymentEnd = new Date(year, month, 25);
  
  periods.push({
    startDate: firstHalfStart,
    endDate: firstHalfEnd,
    label: `1st - 15th ${getMonthName(month)} ${year}`,
    billGenerationDate: firstHalfBillDate,
    paymentWindowStart: firstHalfPaymentStart,
    paymentWindowEnd: firstHalfPaymentEnd,
  });
  
  // Second half period: 16th - End of month
  const lastDay = new Date(year, month + 1, 0).getDate();
  const secondHalfStart = new Date(year, month, 16);
  const secondHalfEnd = new Date(year, month, lastDay);
  const secondHalfBillDate = new Date(year, month, lastDay);
  const secondHalfPaymentStart = new Date(year, month + 1, 1);
  const secondHalfPaymentEnd = new Date(year, month + 1, 5);
  
  periods.push({
    startDate: secondHalfStart,
    endDate: secondHalfEnd,
    label: `16th - ${lastDay}${getOrdinalSuffix(lastDay)} ${getMonthName(month)} ${year}`,
    billGenerationDate: secondHalfBillDate,
    paymentWindowStart: secondHalfPaymentStart,
    paymentWindowEnd: secondHalfPaymentEnd,
  });
  
  return periods;
}

function getMonthName(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Get journeys from completed/locked trips within a billing period
 */
export function getJourneysForPeriod(
  trips: Trip[],
  period: BillingPeriod
): Journey[] {
  const journeys: Journey[] = [];
  
  trips.forEach(trip => {
    // Only include completed trips
    if (trip.status !== 'completed' && trip.status !== 'locked') return;
    
    trip.journeys.forEach(journey => {
      const journeyDate = new Date(journey.createdAt);
      if (journeyDate >= period.startDate && journeyDate <= period.endDate) {
        journeys.push(journey);
      }
    });
  });
  
  return journeys;
}

/**
 * Group journeys by client
 */
export function groupJourneysByClient(
  journeys: Journey[],
  trips: Trip[]
): Map<string, { journeys: Journey[]; tripDetails: Map<string, string> }> {
  const grouped = new Map<string, { journeys: Journey[]; tripDetails: Map<string, string> }>();
  
  journeys.forEach(journey => {
    const existing = grouped.get(journey.clientId);
    const trip = trips.find(t => t.id === journey.tripId);
    
    if (existing) {
      existing.journeys.push(journey);
      if (trip) {
        existing.tripDetails.set(journey.tripId, trip.truckNumber);
      }
    } else {
      const tripDetails = new Map<string, string>();
      if (trip) {
        tripDetails.set(journey.tripId, trip.truckNumber);
      }
      grouped.set(journey.clientId, { journeys: [journey], tripDetails });
    }
  });
  
  return grouped;
}

/**
 * Calculate GST breakdown for a bill
 * Using intra-state GST (CGST + SGST) as default
 */
export function calculateGst(subtotal: number, isInterState: boolean = false) {
  if (isInterState) {
    const igst = subtotal * GST_RATE;
    return {
      cgst: 0,
      sgst: 0,
      igst: Math.round(igst * 100) / 100,
      totalGst: Math.round(igst * 100) / 100,
    };
  }
  
  const cgst = subtotal * CGST_RATE;
  const sgst = subtotal * SGST_RATE;
  
  return {
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: 0,
    totalGst: Math.round((cgst + sgst) * 100) / 100,
  };
}

/**
 * Generate a bill for a client for a specific period
 */
export function generateBillForClient(
  clientId: string,
  client: Client,
  journeys: Journey[],
  trips: Trip[],
  period: BillingPeriod,
  billSequence: number
): Bill {
  const lineItems: BillLineItem[] = journeys.map(journey => {
    const trip = trips.find(t => t.id === journey.tripId);
    return {
      journeyId: journey.id,
      tripId: journey.tripId,
      truckNumber: trip?.truckNumber || 'N/A',
      fromLocation: journey.fromLocation,
      toLocation: journey.toLocation,
      weight: journey.weight,
      ratePerTon: journey.ratePerTon,
      freightAmount: journey.freightAmount,
      clientAdvance: journey.clientAdvance,
      date: journey.createdAt,
    };
  });
  
  const subtotal = lineItems.reduce((sum, item) => sum + item.freightAmount, 0);
  const totalAdvance = lineItems.reduce((sum, item) => sum + item.clientAdvance, 0);
  const gst = calculateGst(subtotal);
  const grandTotal = subtotal + gst.totalGst;
  const netPayable = grandTotal - totalAdvance;
  
  const billNumber = `INV-${period.startDate.getFullYear()}${String(period.startDate.getMonth() + 1).padStart(2, '0')}-${String(billSequence).padStart(4, '0')}`;
  
  return {
    id: `bill-${clientId}-${period.startDate.toISOString()}`,
    billNumber,
    clientId,
    clientName: client.name,
    clientGst: client.gstNumber,
    clientAddress: client.address,
    clientWhatsapp: client.whatsappNumber,
    billingPeriod: {
      startDate: period.startDate.toISOString().split('T')[0],
      endDate: period.endDate.toISOString().split('T')[0],
      label: period.label,
    },
    lineItems,
    subtotal,
    ...gst,
    totalAdvance,
    grandTotal,
    netPayable,
    status: BILL_STATUS.GENERATED,
    generatedAt: new Date().toISOString(),
    payments: [],
  };
}

/**
 * Generate all bills for a billing period
 */
export function generateBillsForPeriod(
  trips: Trip[],
  clients: Client[],
  period: BillingPeriod
): Bill[] {
  const journeys = getJourneysForPeriod(trips, period);
  const groupedByClient = groupJourneysByClient(journeys, trips);
  
  const bills: Bill[] = [];
  let billSequence = 1;
  
  groupedByClient.forEach((data, clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client && data.journeys.length > 0) {
      const bill = generateBillForClient(
        clientId,
        client,
        data.journeys,
        trips,
        period,
        billSequence
      );
      bills.push(bill);
      billSequence++;
    }
  });
  
  return bills;
}

/**
 * Format period for display
 */
export function formatBillingPeriod(period: BillingPeriod): string {
  return period.label;
}

/**
 * Get available billing periods for the last 3 months
 */
export function getAvailableBillingPeriods(): BillingPeriod[] {
  const periods: BillingPeriod[] = [];
  const today = new Date();
  
  for (let i = 0; i < 3; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    periods.push(...getBillingPeriods(date));
  }
  
  // Sort by end date descending
  return periods.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
}
