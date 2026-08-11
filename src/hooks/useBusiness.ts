import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { BusinessEntry, BusinessEntryType } from '../types/Business';
import {
  computeBusinessSummary,
  filterBusinessByMonth,
  sortBusinessEntries,
} from '../utils/businessCalculations';

const STORAGE_KEY = 'business_entries';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export interface AddBusinessEntryInput {
  amount: number;
  type: BusinessEntryType;
  date?: string;
}

export interface UpdateBusinessEntryInput {
  amount: number;
  type: BusinessEntryType;
  date: string;
}

export function useBusiness(year: number, month: number) {
  const [entries, setEntries] = useLocalStorage<BusinessEntry[]>(STORAGE_KEY, []);

  const summary = useMemo(
    () => computeBusinessSummary(entries, year, month),
    [entries, year, month]
  );

  const monthEntries = useMemo(
    () => sortBusinessEntries(filterBusinessByMonth(entries, year, month)),
    [entries, year, month]
  );

  const allEntries = useMemo(() => sortBusinessEntries(entries), [entries]);

  const addEntry = useCallback(
    (input: AddBusinessEntryInput) => {
      const entry: BusinessEntry = {
        id: createId(),
        date: input.date ?? new Date().toISOString(),
        amount: Math.abs(input.amount),
        type: input.type,
      };
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    [setEntries]
  );

  const updateEntry = useCallback(
    (id: string, input: UpdateBusinessEntryInput) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                amount: Math.abs(input.amount),
                type: input.type,
                date: input.date,
              }
            : e
        )
      );
    },
    [setEntries]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setEntries]
  );

  return {
    entries,
    summary,
    monthEntries,
    allEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
