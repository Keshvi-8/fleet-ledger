export const TRIP_STATUS = {
  RUNNING: 'running',
  COMPLETED: 'completed',
  LOCKED: 'locked',
} as const;

export const BILL_STATUS = {
  GENERATED: 'generated',
  SENT: 'sent',
  PAID: 'paid',
} as const;

export const ACCOUNT_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  UPI: 'upi',
} as const;

export type TripStatus = typeof TRIP_STATUS[keyof typeof TRIP_STATUS];
export type BillStatus = typeof BILL_STATUS[keyof typeof BILL_STATUS];
export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];
