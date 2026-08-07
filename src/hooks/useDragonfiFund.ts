import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DragonfiFundState, DragonfiFundTransaction } from '../types/DragonfiFund';

const STORAGE_KEY = 'dragonfi-fund-ledger';

const INITIAL_STATE: DragonfiFundState = {
  transactions: [],
};

export function useDragonfiFund() {
  const [state, setState] = useLocalStorage<DragonfiFundState>(STORAGE_KEY, INITIAL_STATE);

  const totalPhp = useMemo(
    () => state.transactions.reduce((sum, tx) => sum + tx.amountPhp, 0),
    [state.transactions]
  );

  const addTransaction = useCallback(
    (tx: Omit<DragonfiFundTransaction, 'id'>) => {
      const newTx: DragonfiFundTransaction = {
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
    totalPhp,
    transactions: sortedTransactions,
    addTransaction,
    deleteTransaction,
  };
}
