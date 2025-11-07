import type { ComponentType } from 'react';

import {
  Building2,
  Banknote,
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  Leaf as Safe,
  Coins,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

import mintWallet from '../assets/icons/m-wallet.svg';
import docking from '../assets/icons/docking.svg';
import goWallet from '../assets/icons/go-wallet.svg';
import ownBank from '../assets/icons/own-bank.svg';
import timeDeposit from '../assets/icons/time-deposit.svg';

export type IconType = 'lucide' | 'image';

export interface IconOption {
  name: string;
  value: string;
  type: IconType;
  src?: string;
}

export const lucideIconMap: { [key: string]: ComponentType<{ className?: string }> } = {
  'building-2': Building2,
  banknote: Banknote,
  'credit-card': CreditCard,
  wallet: Wallet,
  'piggy-bank': PiggyBank,
  landmark: Landmark,
  safe: Safe,
  coins: Coins,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
};

export const iconOptions: IconOption[] = [
  { name: 'Building 2', value: 'building-2', type: 'lucide' },
  { name: 'Banknote', value: 'banknote', type: 'lucide' },
  { name: 'Credit Card', value: 'credit-card', type: 'lucide' },
  { name: 'Wallet', value: 'wallet', type: 'lucide' },
  { name: 'Piggy Bank', value: 'piggy-bank', type: 'lucide' },
  { name: 'Landmark', value: 'landmark', type: 'lucide' },
  { name: 'Safe', value: 'safe', type: 'lucide' },
  { name: 'Coins', value: 'coins', type: 'lucide' },
  { name: 'Dollar Sign', value: 'dollar-sign', type: 'lucide' },
  { name: 'Trending Up', value: 'trending-up', type: 'lucide' },
  { name: 'Mint Wallet', value: 'mint-wallet', type: 'image', src: mintWallet },
  { name: 'Docking Wallet', value: 'docking-wallet', type: 'image', src: docking },
  { name: 'Go Wallet', value: 'go-wallet', type: 'image', src: goWallet },
  { name: 'Own Bank', value: 'own-bank', type: 'image', src: ownBank },
  { name: 'Time Deposit', value: 'time-deposit', type: 'image', src: timeDeposit },
];

export const getIconOption = (value: string): IconOption | undefined =>
  iconOptions.find((option) => option.value === value);

export const getLucideIcon = (value: string) => lucideIconMap[value];