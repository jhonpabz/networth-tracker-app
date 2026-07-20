import {
  PlannerCategory,
  PlannerCategoryAggregate,
  PlannerItemBreakdown,
  PlannerMetrics,
  PlannerState,
} from '../types/Planner';

export const PLANNER_CHART_COLORS = [
  '#34d399', // emerald
  '#3b82f6', // blue
  '#a855f7', // purple
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1', // indigo
  '#ef4444', // red
  '#22d3ee', // cyan
  '#eab308', // yellow
];

export function computeCategoryTotal(category: PlannerCategory): number {
  return category.items.reduce((sum, item) => sum + item.amount, 0);
}

export function computeTotalMonthly(categories: PlannerCategory[]): number {
  return categories.reduce((sum, cat) => sum + computeCategoryTotal(cat), 0);
}

export function computeItemPercent(amount: number, total: number): number {
  if (total <= 0) return 0;
  return (amount / total) * 100;
}

export function computePlannerMetrics(state: PlannerState): PlannerMetrics {
  const { categories } = state;
  const totalMonthly = computeTotalMonthly(categories);

  let expenseTotal = 0;
  let investmentTotal = 0;

  const categoryAggregates: PlannerCategoryAggregate[] = categories.map((cat) => {
    const total = computeCategoryTotal(cat);
    if (cat.kind === 'expense') expenseTotal += total;
    else investmentTotal += total;

    return {
      id: cat.id,
      name: cat.name,
      kind: cat.kind,
      total,
      percent: computeItemPercent(total, totalMonthly),
      itemCount: cat.items.length,
    };
  });

  let colorIndex = 0;
  const itemBreakdown: PlannerItemBreakdown[] = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      itemBreakdown.push({
        id: item.id,
        name: item.name,
        categoryName: cat.name,
        kind: cat.kind,
        amount: item.amount,
        percent: computeItemPercent(item.amount, totalMonthly),
        color: PLANNER_CHART_COLORS[colorIndex % PLANNER_CHART_COLORS.length],
      });
      colorIndex += 1;
    }
  }

  itemBreakdown.sort((a, b) => b.amount - a.amount);

  const investmentRate = computeItemPercent(investmentTotal, totalMonthly);

  return {
    totalMonthly,
    expenseTotal,
    investmentTotal,
    investmentRate,
    itemBreakdown,
    categoryAggregates,
  };
}
