import { ACCOUNT_TYPES } from './constants';

export const PAYMENT_MODES = ACCOUNT_TYPES;

export type PaymentMode = typeof PAYMENT_MODES[keyof typeof PAYMENT_MODES];

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  mode: PaymentMode;
  date: string;
  reference?: string; // Transaction ID, Cheque No, etc.
  notes?: string;
  recordedAt: string;
}

export interface BillWithPayments {
  billId: string;
  payments: Payment[];
  totalPaid: number;
  balance: number;
}

export const paymentModeLabels: Record<PaymentMode, string> = {
  [PAYMENT_MODES.CASH]: 'Cash',
  [PAYMENT_MODES.BANK]: 'Bank Transfer',
  [PAYMENT_MODES.UPI]: 'UPI',
};

export const paymentModeIcons: Record<PaymentMode, string> = {
  [PAYMENT_MODES.CASH]: '💵',
  [PAYMENT_MODES.BANK]: '🏦',
  [PAYMENT_MODES.UPI]: '📱',
};

export function calculatePaymentSummary(
  netPayable: number,
  payments: Payment[]
): { totalPaid: number; balance: number; isPaidInFull: boolean } {
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = netPayable - totalPaid;
  return {
    totalPaid,
    balance: Math.max(0, balance),
    isPaidInFull: balance <= 0,
  };
}

export function generatePaymentId(): string {
  return `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
