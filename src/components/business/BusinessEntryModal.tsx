import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BusinessEntryType } from '../../types/Business';
import { AddBusinessEntryInput } from '../../hooks/useBusiness';
import {
  dateInputToIso,
  toDateInputValue,
} from '../../utils/businessCalculations';

interface BusinessEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: AddBusinessEntryInput) => void;
}

const BusinessEntryModal: React.FC<BusinessEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<BusinessEntryType>('income');
  const [dateKey, setDateKey] = useState(toDateInputValue(new Date()));
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setType('income');
      setDateKey(toDateInputValue(new Date()));
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) return;

    onSave({
      amount: parsed,
      type,
      date: dateInputToIso(dateKey),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-900 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-100">
            New Entry
          </h2>
          <div className="w-9" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('credit')}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                type === 'credit'
                  ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              Credit
            </button>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="business-date"
              className="text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Date
            </label>
            <input
              id="business-date"
              type="date"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="business-amount"
              className="text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                ₱
              </span>
              <input
                id="business-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-8 pr-3 text-right text-2xl font-semibold tabular-nums focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 ${
                  type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition-colors ${
              type === 'income'
                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                : 'bg-rose-500 text-white hover:bg-rose-400'
            }`}
          >
            {type === 'income' ? 'Add Income' : 'Add Credit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessEntryModal;
