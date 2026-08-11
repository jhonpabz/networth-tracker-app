import React, { useMemo, useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { useBusiness } from '../../hooks/useBusiness';
import { BusinessEntry } from '../../types/Business';
import { getMonthLabel } from '../../utils/spendingCalculations';
import MonthSwitcher from '../spending/MonthSwitcher';
import BusinessSummaryCards from './BusinessSummaryCards';
import BusinessTransactionFeed, { BusinessHistoryView } from './BusinessTransactionFeed';
import BusinessEntryModal from './BusinessEntryModal';
import EditBusinessEntryModal from './EditBusinessEntryModal';

const BusinessPage: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [historyView, setHistoryView] = useState<BusinessHistoryView>('month');
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BusinessEntry | null>(null);

  const {
    entries,
    summary,
    monthEntries,
    allEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useBusiness(year, month);

  const allTimeSummary = useMemo(() => {
    let income = 0;
    let credit = 0;
    for (const e of entries) {
      if (e.type === 'income') income += e.amount;
      else credit += e.amount;
    }
    return { income, credit, balance: income - credit };
  }, [entries]);

  const feedEntries = historyView === 'all' ? allEntries : monthEntries;
  const feedIncome = historyView === 'all' ? allTimeSummary.income : summary.income;
  const feedCredit = historyView === 'all' ? allTimeSummary.credit : summary.credit;

  const handleMonthChange = (nextYear: number, nextMonth: number) => {
    setYear(nextYear);
    setMonth(nextMonth);
  };

  return (
    <div className="relative mx-auto max-w-2xl space-y-4 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-500/15 text-slate-600 dark:text-slate-300">
            <Briefcase className="h-5 w-5" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            Business
          </h1>
        </div>
        <MonthSwitcher year={year} month={month} onChange={handleMonthChange} />
      </div>

      <BusinessSummaryCards summary={summary} />

      <BusinessTransactionFeed
        view={historyView}
        onViewChange={setHistoryView}
        monthLabel={getMonthLabel(year, month)}
        entries={feedEntries}
        income={feedIncome}
        credit={feedCredit}
        onEdit={setEditingEntry}
        onDelete={deleteEntry}
      />

      <button
        type="button"
        onClick={() => setIsEntryOpen(true)}
        aria-label="Add business entry"
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-zinc-900 shadow-2xl transition-transform hover:scale-105 hover:bg-amber-300 active:scale-95 sm:right-8"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      <BusinessEntryModal
        isOpen={isEntryOpen}
        onClose={() => setIsEntryOpen(false)}
        onSave={addEntry}
      />

      <EditBusinessEntryModal
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={updateEntry}
      />
    </div>
  );
};

export default BusinessPage;
