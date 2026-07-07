export interface GoTradeTransaction {
  id: string;
  date: string;
  amountPhp: number;
}

export interface GoTradeState {
  transactions: GoTradeTransaction[];
  fxRate: number;
}
