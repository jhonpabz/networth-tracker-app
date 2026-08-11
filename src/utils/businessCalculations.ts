import { BusinessEntry, BusinessSummary } from '../types/Business';
import { isSameMonth, toDateKey } from './spendingCalculations';

export { toDateKey, getMonthLabel, formatDayHeader, formatTransactionTime } from './spendingCalculations';

export function filterBusinessByMonth(
  entries: BusinessEntry[],
  year: number,
  month: number
): BusinessEntry[] {
  return entries.filter((e) => isSameMonth(e.date, year, month));
}

export function computeBusinessSummary(
  entries: BusinessEntry[],
  year: number,
  month: number
): BusinessSummary {
  const monthEntries = filterBusinessByMonth(entries, year, month);
  let income = 0;
  let credit = 0;

  for (const e of monthEntries) {
    if (e.type === 'income') income += e.amount;
    else credit += e.amount;
  }

  return { income, credit, balance: income - credit };
}

export function sortBusinessEntries(entries: BusinessEntry[]): BusinessEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function toDateInputValue(date: Date | string): string {
  return toDateKey(date);
}

export function dateInputToIso(dateKey: string): string {
  const now = new Date();
  const [y, m, d] = dateKey.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  base.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
  return base.toISOString();
}
