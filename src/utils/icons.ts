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

import maribank from '../assets/icons/maribank.png';
import bdo from '../assets/icons/bdo.png';
import gotyme from '../assets/icons/gotyme.png';
import maya from '../assets/icons/maya.png';


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
  { name: 'Maribank', value: 'Maribank', type: 'image', src: maribank },
  { name: 'BDO', value: 'bdo', type: 'image', src: bdo },
  { name: 'GOtyme', value: 'gotyme', type: 'image', src: gotyme },
  { name: 'Maya', value: 'Maya', type: 'image', src: maya },

];

export const getIconOption = (value: string): IconOption | undefined =>
  iconOptions.find((option) => option.value === value);

export const getLucideIcon = (value: string) => lucideIconMap[value];