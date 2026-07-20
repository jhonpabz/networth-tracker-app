import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  PlannerCategory,
  PlannerCategoryKind,
  PlannerItem,
  PlannerState,
} from '../types/Planner';
import { computePlannerMetrics } from '../utils/plannerCalculations';

const STORAGE_KEY = 'planner_data';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const INITIAL_STATE: PlannerState = {
  categories: [
    { id: 'cat-utilities', name: 'Utilities', kind: 'expense', items: [] },
    { id: 'cat-investments', name: 'Investments', kind: 'investment', items: [] },
    { id: 'cat-savings', name: 'Savings', kind: 'investment', items: [] },
    { id: 'cat-subscriptions', name: 'Subscriptions', kind: 'expense', items: [] },
  ],
};

export function usePlanner() {
  const [state, setState] = useLocalStorage<PlannerState>(STORAGE_KEY, INITIAL_STATE);

  const metrics = useMemo(() => computePlannerMetrics(state), [state]);

  const addCategory = useCallback(
    (name: string, kind: PlannerCategoryKind) => {
      const category: PlannerCategory = {
        id: createId(),
        name: name.trim(),
        kind,
        items: [],
      };
      setState((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    },
    [setState]
  );

  const updateCategory = useCallback(
    (id: string, updates: { name: string; kind: PlannerCategoryKind }) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === id
            ? { ...cat, name: updates.name.trim(), kind: updates.kind }
            : cat
        ),
      }));
    },
    [setState]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat.id !== id),
      }));
    },
    [setState]
  );

  const addItem = useCallback(
    (categoryId: string, name: string, amount: number) => {
      const item: PlannerItem = {
        id: createId(),
        name: name.trim(),
        amount,
      };
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, items: [...cat.items, item] } : cat
        ),
      }));
    },
    [setState]
  );

  const updateItem = useCallback(
    (categoryId: string, itemId: string, name: string, amount: number) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map((item) =>
                  item.id === itemId
                    ? { ...item, name: name.trim(), amount }
                    : item
                ),
              }
            : cat
        ),
      }));
    },
    [setState]
  );

  const deleteItem = useCallback(
    (categoryId: string, itemId: string) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
            : cat
        ),
      }));
    },
    [setState]
  );

  return {
    categories: state.categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
  };
}
