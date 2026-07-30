import {
  DailyBreakdown,
  MonthlySummary,
  TransactionEntry,
} from '../types/Spending';

/** Local calendar date key YYYY-MM-DD */
export function toDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameMonth(date: Date | string, year: number, month: number): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getFullYear() === year && d.getMonth() === month;
}

export function filterByMonth(
  transactions: TransactionEntry[],
  year: number,
  month: number
): TransactionEntry[] {
  return transactions.filter((t) => isSameMonth(t.date, year, month));
}

export function filterByDateKey(
  transactions: TransactionEntry[],
  dateKey: string
): TransactionEntry[] {
  return transactions.filter((t) => toDateKey(t.date) === dateKey);
}

export function computeMonthlySummary(
  transactions: TransactionEntry[],
  year: number,
  month: number
): MonthlySummary {
  const monthTx = filterByMonth(transactions, year, month);
  let income = 0;
  let expense = 0;

  for (const t of monthTx) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }

  return { income, expense, balance: income - expense };
}

export function computeDailyBreakdowns(
  transactions: TransactionEntry[],
  year: number,
  month: number
): Map<string, DailyBreakdown> {
  const map = new Map<string, DailyBreakdown>();
  const monthTx = filterByMonth(transactions, year, month);

  for (const t of monthTx) {
    const key = toDateKey(t.date);
    let day = map.get(key);
    if (!day) {
      day = { dateKey: key, income: 0, expense: 0, transactions: [] };
      map.set(key, day);
    }
    if (t.type === 'income') day.income += t.amount;
    else day.expense += t.amount;
    day.transactions.push(t);
  }

  for (const day of map.values()) {
    day.transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return map;
}

/**
 * Safely evaluate a basic arithmetic expression (numbers + - * / and parentheses).
 * Returns null if the expression is invalid.
 */
export function evaluateExpression(expr: string): number | null {
  const cleaned = expr.replace(/\s/g, '').replace(/×/g, '*').replace(/÷/g, '/');
  if (!cleaned || !/^[\d.+\-*/()]+$/.test(cleaned)) return null;
  if (!/\d/.test(cleaned)) return null;

  try {
    // Tokenize and evaluate with shunting-yard / RPN for safety (no Function/eval)
    const tokens = tokenize(cleaned);
    if (!tokens) return null;
    const rpn = toRpn(tokens);
    if (!rpn) return null;
    const result = evalRpn(rpn);
    if (result === null || !Number.isFinite(result)) return null;
    return Math.round(result * 100) / 100;
  } catch {
    return null;
  }
}

type Token = { kind: 'num'; value: number } | { kind: 'op'; value: string };

function tokenize(expr: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === '(' || ch === ')') {
      tokens.push({ kind: 'op', value: ch });
      i++;
      continue;
    }
    if ('+-*/'.includes(ch)) {
      const prev = tokens[tokens.length - 1];
      const isUnary =
        ch === '-' &&
        (!prev || (prev.kind === 'op' && prev.value !== ')'));
      if (isUnary) {
        let j = i + 1;
        let num = '';
        while (j < expr.length && (/\d/.test(expr[j]) || expr[j] === '.')) {
          num += expr[j];
          j++;
        }
        if (!num) return null;
        const value = parseFloat(`-${num}`);
        if (Number.isNaN(value)) return null;
        tokens.push({ kind: 'num', value });
        i = j;
        continue;
      }
      tokens.push({ kind: 'op', value: ch });
      i++;
      continue;
    }
    if (/\d/.test(ch) || ch === '.') {
      let num = '';
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      const value = parseFloat(num);
      if (Number.isNaN(value)) return null;
      tokens.push({ kind: 'num', value });
      continue;
    }
    return null;
  }
  return tokens;
}

const PRECEDENCE: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

function toRpn(tokens: Token[]): Token[] | null {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    if (token.kind === 'num') {
      output.push(token);
      continue;
    }
    if (token.value === '(') {
      stack.push(token);
      continue;
    }
    if (token.value === ')') {
      while (stack.length && stack[stack.length - 1].value !== '(') {
        output.push(stack.pop()!);
      }
      if (!stack.length) return null;
      stack.pop();
      continue;
    }
    while (
      stack.length &&
      stack[stack.length - 1].value !== '(' &&
      (PRECEDENCE[stack[stack.length - 1].value] ?? 0) >=
        (PRECEDENCE[token.value] ?? 0)
    ) {
      output.push(stack.pop()!);
    }
    stack.push(token);
  }

  while (stack.length) {
    const op = stack.pop()!;
    if (op.value === '(' || op.value === ')') return null;
    output.push(op);
  }
  return output;
}

function evalRpn(tokens: Token[]): number | null {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token.kind === 'num') {
      stack.push(token.value);
      continue;
    }
    if (stack.length < 2) return null;
    const b = stack.pop()!;
    const a = stack.pop()!;
    switch (token.value) {
      case '+':
        stack.push(a + b);
        break;
      case '-':
        stack.push(a - b);
        break;
      case '*':
        stack.push(a * b);
        break;
      case '/':
        if (b === 0) return null;
        stack.push(a / b);
        break;
      default:
        return null;
    }
  }
  return stack.length === 1 ? stack[0] : null;
}

export function formatCompactAmount(amount: number): string {
  if (amount >= 10000) {
    return amount.toLocaleString('en-PH', {
      maximumFractionDigits: 0,
    });
  }
  return amount.toLocaleString('en-PH', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function getMonthLabel(year: number, month: number, now = new Date()): string {
  if (year === now.getFullYear() && month === now.getMonth()) {
    return 'This Month';
  }
  const label = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  return label;
}

export function formatDayHeader(dateKey: string): string {
  const d = parseDateKey(dateKey);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTransactionTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
