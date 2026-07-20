export type PlannerCategoryKind = 'expense' | 'investment';

export interface PlannerItem {
  id: string;
  name: string;
  amount: number;
}

export interface PlannerCategory {
  id: string;
  name: string;
  kind: PlannerCategoryKind;
  items: PlannerItem[];
}

export interface PlannerState {
  categories: PlannerCategory[];
}

export interface PlannerItemBreakdown {
  id: string;
  name: string;
  categoryName: string;
  kind: PlannerCategoryKind;
  amount: number;
  percent: number;
  color: string;
}

export interface PlannerCategoryAggregate {
  id: string;
  name: string;
  kind: PlannerCategoryKind;
  total: number;
  percent: number;
  itemCount: number;
}

export interface PlannerMetrics {
  totalMonthly: number;
  expenseTotal: number;
  investmentTotal: number;
  investmentRate: number;
  itemBreakdown: PlannerItemBreakdown[];
  categoryAggregates: PlannerCategoryAggregate[];
}
