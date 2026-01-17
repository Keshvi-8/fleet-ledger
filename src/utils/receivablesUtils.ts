import { Bill } from './billingUtils';
import { BILL_STATUS } from './constants';
import { differenceInDays } from 'date-fns';

export interface AgingBucket {
  label: string;
  min: number;
  max: number;
  amount: number;
  count: number;
  bills: Bill[];
}

export interface ClientReceivable {
  clientId: string;
  clientName: string;
  clientWhatsapp: string;
  totalOutstanding: number;
  billCount: number;
  aging: {
    current: number; // 0-30 days
    days31to60: number;
    days61to90: number;
    over90: number;
  };
  bills: Bill[];
  oldestBillDays: number;
}

export const AGING_BUCKETS = [
  { label: '0-30 Days', min: 0, max: 30 },
  { label: '31-60 Days', min: 31, max: 60 },
  { label: '61-90 Days', min: 61, max: 90 },
  { label: '90+ Days', min: 91, max: Infinity },
] as const;

export const calculateBillAge = (bill: Bill, referenceDate: Date = new Date()): number => {
  const billDate = new Date(bill.generatedAt);
  return differenceInDays(referenceDate, billDate);
};

export const getAgingBucket = (daysOld: number): keyof ClientReceivable['aging'] => {
  if (daysOld <= 30) return 'current';
  if (daysOld <= 60) return 'days31to60';
  if (daysOld <= 90) return 'days61to90';
  return 'over90';
};

export const calculateAgingBuckets = (bills: Bill[]): AgingBucket[] => {
  const outstandingBills = bills.filter((b) => b.status !== BILL_STATUS.PAID);
  
  return AGING_BUCKETS.map(({ label, min, max }) => {
    const bucketBills = outstandingBills.filter((bill) => {
      const age = calculateBillAge(bill);
      return age >= min && age <= max;
    });
    
    return {
      label,
      min,
      max,
      amount: bucketBills.reduce((sum, b) => sum + b.netPayable, 0),
      count: bucketBills.length,
      bills: bucketBills,
    };
  });
};

export const calculateClientReceivables = (bills: Bill[]): ClientReceivable[] => {
  const outstandingBills = bills.filter((b) => b.status !== BILL_STATUS.PAID);
  
  // Group by client
  const clientMap = new Map<string, Bill[]>();
  outstandingBills.forEach((bill) => {
    const existing = clientMap.get(bill.clientId) || [];
    existing.push(bill);
    clientMap.set(bill.clientId, existing);
  });
  
  // Calculate receivables per client
  const receivables: ClientReceivable[] = [];
  
  clientMap.forEach((clientBills, clientId) => {
    const aging = {
      current: 0,
      days31to60: 0,
      days61to90: 0,
      over90: 0,
    };
    
    let oldestBillDays = 0;
    
    clientBills.forEach((bill) => {
      const daysOld = calculateBillAge(bill);
      const bucket = getAgingBucket(daysOld);
      aging[bucket] += bill.netPayable;
      
      if (daysOld > oldestBillDays) {
        oldestBillDays = daysOld;
      }
    });
    
    const firstBill = clientBills[0];
    
    receivables.push({
      clientId,
      clientName: firstBill.clientName,
      clientWhatsapp: firstBill.clientWhatsapp,
      totalOutstanding: clientBills.reduce((sum, b) => sum + b.netPayable, 0),
      billCount: clientBills.length,
      aging,
      bills: clientBills.sort((a, b) => 
        new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()
      ),
      oldestBillDays,
    });
  });
  
  // Sort by total outstanding (highest first)
  return receivables.sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};

export const getAgingColorClass = (bucket: keyof ClientReceivable['aging']): string => {
  switch (bucket) {
    case 'current':
      return 'text-success';
    case 'days31to60':
      return 'text-warning';
    case 'days61to90':
      return 'text-orange-500';
    case 'over90':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export const getAgingBgClass = (bucket: keyof ClientReceivable['aging']): string => {
  switch (bucket) {
    case 'current':
      return 'bg-success/10';
    case 'days31to60':
      return 'bg-warning/10';
    case 'days61to90':
      return 'bg-orange-500/10';
    case 'over90':
      return 'bg-destructive/10';
    default:
      return 'bg-muted';
  }
};
