export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
  icon: string;
  iconType?: 'lucide' | 'image';
}

export interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}