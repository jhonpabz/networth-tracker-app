export type TransactionType = 'income' | 'expense';

export interface TransactionEntry {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
}

export interface DailyBreakdown {
  dateKey: string;
  income: number;
  expense: number;
  transactions: TransactionEntry[];
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export const SPENDING_CATEGORIES = [
  'Foods',
  'Tiktok',
  'Coffee',
  'Transport',
  '+Balance',
  'Health',
  'Transfer',
  'Other',
] as const;

export type SpendingCategory = (typeof SPENDING_CATEGORIES)[number];
