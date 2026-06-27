import {
  InvestmentAsset,
  InvestmentState,
  InvestmentTransaction,
  HoldingWithMetrics,
  PortfolioMetrics,
  PerformanceDataPoint,
  PerformanceTimeframe,
  PortfolioSnapshot,
} from '../types/Investment';

const TICKER_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  TSLA: 'Tesla Inc.',
  NVDA: 'NVIDIA Corp.',
};

export const getAssetName = (ticker: string, fallback?: string): string => {
  return fallback || TICKER_NAMES[ticker.toUpperCase()] || ticker.toUpperCase();
};

export const buildHoldingsFromTransactions = (
  transactions: InvestmentTransaction[],
  priceOverrides: InvestmentState['priceOverrides'] = {}
): InvestmentAsset[] => {
  const holdingsMap = new Map<string, InvestmentAsset>();

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const tx of sorted) {
    const ticker = tx.ticker.toUpperCase();
    const existing = holdingsMap.get(ticker);
    const override = priceOverrides[ticker];

    if (tx.side === 'buy') {
      if (existing) {
        const totalQty = existing.quantity + tx.quantity;
        const totalCost = existing.quantity * existing.avgCost + tx.quantity * tx.entryPrice;
        holdingsMap.set(ticker, {
          ...existing,
          quantity: totalQty,
          avgCost: totalCost / totalQty,
          currentPrice: override?.currentPrice ?? tx.entryPrice,
          previousClose: override?.previousClose ?? existing.previousClose,
        });
      } else {
        holdingsMap.set(ticker, {
          ticker,
          name: tx.name || getAssetName(ticker),
          assetType: tx.assetType,
          quantity: tx.quantity,
          avgCost: tx.entryPrice,
          currentPrice: override?.currentPrice ?? tx.entryPrice,
          previousClose: override?.previousClose ?? tx.entryPrice * 0.995,
        });
      }
    } else if (existing) {
      const newQty = Math.max(0, existing.quantity - tx.quantity);
      if (newQty === 0) {
        holdingsMap.delete(ticker);
      } else {
        holdingsMap.set(ticker, {
          ...existing,
          quantity: newQty,
          currentPrice: override?.currentPrice ?? tx.entryPrice,
        });
      }
    }
  }

  return Array.from(holdingsMap.values()).filter((h) => h.quantity > 0);
};

export const calculatePortfolioMetrics = (
  transactions: InvestmentTransaction[],
  priceOverrides: InvestmentState['priceOverrides'] = {},
  snapshot24h: PortfolioSnapshot | null = null
): PortfolioMetrics => {
  const assets = buildHoldingsFromTransactions(transactions, priceOverrides);
  const totalValue = assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
  const totalCost = assets.reduce((sum, a) => sum + a.quantity * a.avgCost, 0);

  const holdings: HoldingWithMetrics[] = assets.map((asset) => {
    const currentValue = asset.quantity * asset.currentPrice;
    const allocationPercent = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    const pnl24h = asset.quantity * (asset.currentPrice - asset.previousClose);
    const pnl24hPercent =
      asset.previousClose > 0
        ? ((asset.currentPrice - asset.previousClose) / asset.previousClose) * 100
        : 0;

    return {
      ...asset,
      currentValue,
      allocationPercent,
      pnl24h,
      pnl24hPercent,
      unrealizedPnL: currentValue - asset.quantity * asset.avgCost,
    };
  });

  holdings.sort((a, b) => b.currentValue - a.currentValue);

  const holdingsPnl24h = holdings.reduce((sum, h) => sum + h.pnl24h, 0);
  const snapshotValue = snapshot24h?.value ?? totalValue - holdingsPnl24h;
  const pnl24h = totalValue - snapshotValue;
  const pnl24hPercent = snapshotValue > 0 ? (pnl24h / snapshotValue) * 100 : 0;

  return {
    totalValue,
    totalCost,
    pnl24h,
    pnl24hPercent,
    holdings,
  };
};

export const computePortfolioValueAtDate = (
  transactions: InvestmentTransaction[],
  targetDate: Date,
  priceOverrides: InvestmentState['priceOverrides'] = {}
): number => {
  const relevant = transactions.filter((tx) => new Date(tx.date) <= targetDate);
  const assets = buildHoldingsFromTransactions(relevant, priceOverrides);
  return assets.reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);
};

export const generatePerformanceHistory = (
  transactions: InvestmentTransaction[],
  timeframe: PerformanceTimeframe,
  priceOverrides: InvestmentState['priceOverrides'] = {}
): PerformanceDataPoint[] => {
  const now = new Date();
  const daysMap: Record<PerformanceTimeframe, number> = { '1W': 7, '1M': 30, '1Y': 365 };
  const days = daysMap[timeframe];
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  const points: PerformanceDataPoint[] = [];
  const step = days <= 7 ? 1 : days <= 30 ? 2 : 7;

  for (let d = 0; d <= days; d += step) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    const value = computePortfolioValueAtDate(transactions, date, priceOverrides);
    points.push({
      date: date.toISOString().split('T')[0],
      value,
    });
  }

  if (points.length > 0) {
    const last = points[points.length - 1];
    const currentValue = computePortfolioValueAtDate(transactions, now, priceOverrides);
    if (last.value !== currentValue) {
      points.push({
        date: now.toISOString().split('T')[0],
        value: currentValue,
      });
    }
  }

  return points.length > 0 ? points : [{ date: now.toISOString().split('T')[0], value: 0 }];
};

export const shouldRefreshSnapshot = (snapshot: PortfolioSnapshot | null): boolean => {
  if (!snapshot) return true;
  const elapsed = Date.now() - new Date(snapshot.timestamp).getTime();
  return elapsed >= 24 * 60 * 60 * 1000;
};
