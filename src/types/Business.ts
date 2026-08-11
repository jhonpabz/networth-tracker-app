export type BusinessEntryType = 'income' | 'credit';

export interface BusinessEntry {
  id: string;
  date: string;
  amount: number;
  type: BusinessEntryType;
}

export interface BusinessSummary {
  income: number;
  credit: number;
  balance: number;
}
