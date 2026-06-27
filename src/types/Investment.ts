export type AssetType = 'stock' | 'crypto';
export type TransactionSide = 'buy' | 'sell';

export interface InvestmentTransaction {
  id: string;
  assetType: AssetType;
  ticker: string;
  name: string;
  side: TransactionSide;
  quantity: number;
  entryPrice: number;
  date: string;
}

export interface InvestmentAsset {
  ticker: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  previousClose: number;
}

export interface PortfolioSnapshot {
  value: number;
  timestamp: string;
}

export interface InvestmentState {
  transactions: InvestmentTransaction[];
  priceOverrides: Record<string, { currentPrice: number; previousClose: number }>;
  snapshot24h: PortfolioSnapshot | null;
}

export interface HoldingWithMetrics extends InvestmentAsset {
  currentValue: number;
  allocationPercent: number;
  pnl24h: number;
  pnl24hPercent: number;
  unrealizedPnL: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  pnl24h: number;
  pnl24hPercent: number;
  holdings: HoldingWithMetrics[];
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export type InvestmentViewMode = 'performance' | 'allocation';
export type GlobalTab = 'networth' | 'investments';
export type PerformanceTimeframe = '1W' | '1M' | '1Y';
