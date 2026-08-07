export interface DragonfiFundTransaction {
  id: string;
  date: string;
  amountPhp: number;
}

export interface DragonfiFundState {
  transactions: DragonfiFundTransaction[];
}
