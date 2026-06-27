import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  InvestmentState,
  InvestmentTransaction,
  PortfolioMetrics,
} from '../types/Investment';
import {
  calculatePortfolioMetrics,
  shouldRefreshSnapshot,
} from '../utils/investmentCalculations';

const INITIAL_STATE: InvestmentState = {
  transactions: [],
  priceOverrides: {},
  snapshot24h: null,
};

export function useInvestments() {
  const [state, setState] = useLocalStorage<InvestmentState>(
    'investment-ledger',
    INITIAL_STATE
  );

  const getMetrics = useCallback((): PortfolioMetrics => {
    return calculatePortfolioMetrics(
      state.transactions,
      state.priceOverrides,
      state.snapshot24h
    );
  }, [state]);

  const addTransaction = useCallback(
    (tx: Omit<InvestmentTransaction, 'id'>) => {
      const newTx: InvestmentTransaction = {
        ...tx,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        ticker: tx.ticker.toUpperCase(),
      };

      setState((prev) => {
        const metrics = calculatePortfolioMetrics(prev.transactions, prev.priceOverrides, prev.snapshot24h);
        let snapshot24h = prev.snapshot24h;

        if (shouldRefreshSnapshot(snapshot24h)) {
          snapshot24h = {
            value: metrics.totalValue,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          ...prev,
          transactions: [...prev.transactions, newTx],
          snapshot24h,
        };
      });
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

  return {
    state,
    metrics: getMetrics(),
    addTransaction,
    deleteTransaction,
  };
}
