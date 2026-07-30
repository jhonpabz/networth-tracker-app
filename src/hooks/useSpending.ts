import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TransactionEntry, TransactionType } from '../types/Spending';
import {
  computeDailyBreakdowns,
  computeMonthlySummary,
  filterByDateKey,
} from '../utils/spendingCalculations';

const STORAGE_KEY = 'spending_transactions';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export interface AddTransactionInput {
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date?: string;
}

export function useSpending(year: number, month: number, selectedDateKey: string) {
  const [transactions, setTransactions] = useLocalStorage<TransactionEntry[]>(
    STORAGE_KEY,
    []
  );

  const summary = useMemo(
    () => computeMonthlySummary(transactions, year, month),
    [transactions, year, month]
  );

  const dailyMap = useMemo(
    () => computeDailyBreakdowns(transactions, year, month),
    [transactions, year, month]
  );

  const selectedDayTransactions = useMemo(
    () => filterByDateKey(transactions, selectedDateKey).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    [transactions, selectedDateKey]
  );

  const addTransaction = useCallback(
    (input: AddTransactionInput) => {
      const entry: TransactionEntry = {
        id: createId(),
        date: input.date ?? new Date().toISOString(),
        amount: Math.abs(input.amount),
        type: input.type,
        category: input.category,
        note: input.note.trim(),
      };
      setTransactions((prev) => [entry, ...prev]);
      return entry;
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Omit<TransactionEntry, 'id'>>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [setTransactions]
  );

  return {
    transactions,
    summary,
    dailyMap,
    selectedDayTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
