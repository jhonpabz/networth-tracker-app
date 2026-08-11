import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useSpending } from '../../hooks/useSpending';
import { TransactionEntry } from '../../types/Spending';
import {
  getMonthLabel,
  toDateKey,
} from '../../utils/spendingCalculations';
import MonthSwitcher from './MonthSwitcher';
import MonthlySummaryCards from './MonthlySummaryCards';
import CalendarGrid from './CalendarGrid';
import TransactionFeed, { HistoryView } from './TransactionFeed';
import SimpleEntryModal from './SimpleEntryModal';
import EditTransactionModal from './EditTransactionModal';

const SpendingPage: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(now));
  const [historyView, setHistoryView] = useState<HistoryView>('day');
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionEntry | null>(
    null
  );

  const {
    summary,
    dailyMap,
    selectedDayTransactions,
    monthTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useSpending(year, month, selectedDateKey);

  useEffect(() => {
    const selected = new Date(selectedDateKey + 'T12:00:00');
    if (selected.getFullYear() !== year || selected.getMonth() !== month) {
      const today = new Date();
      if (today.getFullYear() === year && today.getMonth() === month) {
        setSelectedDateKey(toDateKey(today));
      } else {
        setSelectedDateKey(toDateKey(new Date(year, month, 1)));
      }
    }
  }, [year, month, selectedDateKey]);

  const handleMonthChange = (nextYear: number, nextMonth: number) => {
    setYear(nextYear);
    setMonth(nextMonth);
  };

  const handleSelectDate = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setHistoryView('day');
  };

  const dayBreakdown = dailyMap.get(selectedDateKey);
  const feedTransactions =
    historyView === 'all' ? monthTransactions : selectedDayTransactions;
  const feedIncome =
    historyView === 'all' ? summary.income : (dayBreakdown?.income ?? 0);
  const feedExpense =
    historyView === 'all' ? summary.expense : (dayBreakdown?.expense ?? 0);

  const entryDefaultDate = (() => {
    const [y, m, d] = selectedDateKey.split('-').map(Number);
    const base = new Date(y, m - 1, d);
    const nowTime = new Date();
    base.setHours(nowTime.getHours(), nowTime.getMinutes(), nowTime.getSeconds());
    return base.toISOString();
  })();

  return (
    <div className="relative mx-auto max-w-2xl space-y-4 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          Spending
        </h1>
        <MonthSwitcher year={year} month={month} onChange={handleMonthChange} />
      </div>

      <MonthlySummaryCards summary={summary} />

      <CalendarGrid
        year={year}
        month={month}
        dailyMap={dailyMap}
        selectedDateKey={selectedDateKey}
        onSelectDate={handleSelectDate}
      />

      <TransactionFeed
        view={historyView}
        onViewChange={setHistoryView}
        dateKey={selectedDateKey}
        monthLabel={getMonthLabel(year, month)}
        transactions={feedTransactions}
        income={feedIncome}
        expense={feedExpense}
        onEdit={setEditingTransaction}
        onDelete={deleteTransaction}
      />

      <button
        type="button"
        onClick={() => setIsEntryOpen(true)}
        aria-label="Add transaction"
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-zinc-900 shadow-2xl transition-transform hover:scale-105 hover:bg-amber-300 active:scale-95 sm:right-8"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      <SimpleEntryModal
        isOpen={isEntryOpen}
        onClose={() => setIsEntryOpen(false)}
        onSave={addTransaction}
        defaultDate={entryDefaultDate}
      />

      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={updateTransaction}
      />
    </div>
  );
};

export default SpendingPage;
