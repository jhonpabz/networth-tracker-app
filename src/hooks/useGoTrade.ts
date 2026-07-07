import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { GoTradeState, GoTradeTransaction } from '../types/GoTrade';

const STORAGE_KEY = 'gotrade-voo-ledger';
const DEFAULT_FX_RATE = 58.0;

const INITIAL_STATE: GoTradeState = {
  transactions: [],
  fxRate: DEFAULT_FX_RATE,
};

export function useGoTrade() {
  const [state, setState] = useLocalStorage<GoTradeState>(STORAGE_KEY, INITIAL_STATE);

  const totalPhp = useMemo(
    () => state.transactions.reduce((sum, tx) => sum + tx.amountPhp, 0),
    [state.transactions]
  );

  const totalUsd = useMemo(() => {
    if (state.fxRate <= 0) return 0;
    return totalPhp / state.fxRate;
  }, [totalPhp, state.fxRate]);

  const setFxRate = useCallback(
    (rate: number) => {
      setState((prev) => ({ ...prev, fxRate: rate }));
    },
    [setState]
  );

  const addTransaction = useCallback(
    (tx: Omit<GoTradeTransaction, 'id'>) => {
      const newTx: GoTradeTransaction = {
        ...tx,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      };
      setState((prev) => ({
        ...prev,
        transactions: [...prev.transactions, newTx],
      }));
    },
    [setState]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((tx) => tx.id !== id),
      }));
    },
    [setState]
  );

  const sortedTransactions = useMemo(
    () =>
      [...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [state.transactions]
  );

  return {
    fxRate: state.fxRate,
    totalPhp,
    totalUsd,
    transactions: sortedTransactions,
    setFxRate,
    addTransaction,
    deleteTransaction,
  };
}
