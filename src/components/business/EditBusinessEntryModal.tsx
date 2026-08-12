import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BusinessEntry, BusinessEntryType } from '../../types/Business';
import { UpdateBusinessEntryInput } from '../../hooks/useBusiness';
import {
  dateInputToIso,
  toDateInputValue,
} from '../../utils/businessCalculations';

interface EditBusinessEntryModalProps {
  entry: BusinessEntry | null;
  onClose: () => void;
  onSave: (id: string, input: UpdateBusinessEntryInput) => void;
}

const EditBusinessEntryModal: React.FC<EditBusinessEntryModalProps> = ({
  entry,
  onClose,
  onSave,
}) => {
  const isOpen = entry !== null;
  const [type, setType] = useState<BusinessEntryType>('income');
  const [dateKey, setDateKey] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (entry) {
      setType(entry.type);
      setDateKey(toDateInputValue(entry.date));
      setAmount(String(entry.amount));
      setNote(entry.note ?? '');
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) return;

    onSave(entry.id, {
      amount: parsed,
      type,
      date: dateInputToIso(dateKey),
      note,
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
            Edit Entry
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
              htmlFor="edit-business-date"
              className="text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Date
            </label>
            <input
              id="edit-business-date"
              type="date"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-business-amount"
              className="text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                ₱
              </span>
              <input
                id="edit-business-amount"
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

          <div className="space-y-1.5">
            <label
              htmlFor="edit-business-note"
              className="text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              Note
            </label>
            <input
              id="edit-business-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Client payment, supplies…"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-amber-400 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-amber-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessEntryModal;
