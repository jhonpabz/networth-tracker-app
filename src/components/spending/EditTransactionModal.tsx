import React, { useEffect, useState } from 'react';
import { Delete, Equal, X } from 'lucide-react';
import {
  INCOME_CATEGORY,
  SPENDING_CATEGORIES,
  TransactionEntry,
} from '../../types/Spending';
import { evaluateExpression } from '../../utils/spendingCalculations';
import { UpdateTransactionInput } from '../../hooks/useSpending';

interface EditTransactionModalProps {
  transaction: TransactionEntry | null;
  onClose: () => void;
  onSave: (id: string, input: UpdateTransactionInput) => void;
}

const KEYS = [
  ['7', '8', '9', 'back'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '-'],
  ['0', '.', '±', '='],
] as const;

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onClose,
  onSave,
}) => {
  const isOpen = transaction !== null;
  const isIncome = transaction?.type === 'income';

  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [expression, setExpression] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const visibleCategories = isIncome
    ? [INCOME_CATEGORY]
    : [...SPENDING_CATEGORIES];

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category);
      setNote(transaction.note);
      setExpression(String(transaction.amount));
      setJustEvaluated(false);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const appendDigit = (digit: string) => {
    setExpression((prev) => {
      if (justEvaluated) {
        setJustEvaluated(false);
        return digit === '.' ? '0.' : digit;
      }
      if (prev === '0' && digit !== '.') return digit;
      if (digit === '.' && /(\d*\.\d*)$/.test(prev.split(/[+\-*/]/).pop() ?? '')) {
        return prev;
      }
      return prev + digit;
    });
  };

  const appendOperator = (op: string) => {
    setJustEvaluated(false);
    setExpression((prev) => {
      const trimmed = prev.replace(/[+\-*/.]$/, '');
      if (!trimmed) return '0' + op;
      return trimmed + op;
    });
  };

  const handleBackspace = () => {
    setJustEvaluated(false);
    setExpression((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleEquals = () => {
    const result = evaluateExpression(expression);
    if (result === null) return;
    setExpression(String(result));
    setJustEvaluated(true);
  };

  const handleToggleSign = () => {
    setJustEvaluated(false);
    setExpression((prev) => {
      const result = evaluateExpression(prev);
      if (result === null || result === 0) return prev;
      return String(-result);
    });
  };

  const handleKey = (key: string) => {
    if (key === 'back') handleBackspace();
    else if (key === '=') handleEquals();
    else if (key === '±') handleToggleSign();
    else if (key === '+' || key === '-') appendOperator(key);
    else appendDigit(key);
  };

  const handleSubmit = () => {
    const amount = evaluateExpression(expression);
    if (amount === null || amount <= 0) return;

    onSave(transaction.id, {
      amount: Math.abs(amount),
      category,
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

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-900 shadow-2xl sm:rounded-3xl max-h-[92vh]">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="p-2 transition-colors rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-100">
            Edit {isIncome ? 'Balance' : 'Expense'}
          </h2>
          <div className="w-9" />
        </div>

        <div className="px-5 py-4 text-right">
          <p
            className={`truncate text-4xl font-semibold tracking-tight tabular-nums ${
              isIncome ? 'text-emerald-400' : 'text-zinc-50'
            }`}
          >
            {isIncome ? '+' : '−'}
            {expression}
          </p>
        </div>

        <div className="px-3 py-2 mx-4 mb-3 border rounded-xl border-white/10 bg-white/5">
          <label className="sr-only" htmlFor="edit-spending-note">
            Note
          </label>
          <input
            id="edit-spending-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note: Coffee, groceries…"
            className="w-full text-base bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleCategories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-amber-400 text-zinc-900'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-4 gap-2 px-4 pb-3">
          {KEYS.flat().map((key) => {
            const isOp = key === '+' || key === '-' || key === '=' || key === 'back' || key === '±';
            const isEquals = key === '=';
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                className={`flex h-14 items-center justify-center rounded-2xl text-xl font-medium transition-all active:scale-95 ${
                  isEquals
                    ? 'bg-amber-400 text-zinc-900 hover:bg-amber-300'
                    : isOp
                      ? 'bg-white/10 text-zinc-200 hover:bg-white/15'
                      : 'bg-white/5 text-zinc-100 hover:bg-white/10'
                }`}
              >
                {key === 'back' ? (
                  <Delete className="w-5 h-5" />
                ) : key === '=' ? (
                  <Equal className="w-5 h-5" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition-colors ${
              isIncome
                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                : 'bg-rose-500 text-white hover:bg-rose-400'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
