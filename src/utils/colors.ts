export const colorOptions = [
  { name: 'Emerald', value: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
  { name: 'Blue', value: 'blue', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Purple', value: 'purple', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Orange', value: 'orange', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Pink', value: 'pink', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Teal', value: 'teal', gradient: 'from-[#05e3e8] to-[#05cfee]' },
  { name: 'Indigo', value: 'indigo', gradient: 'from-indigo-500 to-indigo-600' },
  { name: 'Red', value: 'red', gradient: 'from-red-500 to-red-600' },
];

export const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: string } = {
    emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    teal: 'bg-gradient-to-br from-[#05e3e8] to-[#05cfee] hover:from-[#00e8f9] hover:to-[#00d7fc]',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    red: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  };
  return colorMap[color] || colorMap.blue;
};

interface TilePalette {
  background: string;
  badge: string;
  subtleText: string;
}

const tilePalettes: { [key: string]: TilePalette } = {
  emerald: {
    background: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-emerald-50/80',
  },
  blue: {
    background: 'bg-gradient-to-br from-blue-500 to-blue-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-sky-100',
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-500 to-purple-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-violet-100',
  },
  orange: {
    background: 'bg-gradient-to-br from-orange-500 to-orange-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-orange-50/80',
  },
  pink: {
    background: 'bg-gradient-to-br from-pink-500 to-pink-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-pink-50/80',
  },
  teal: {
    background: 'bg-gradient-to-br from-[#05e3e8] to-[#05cfee]',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-teal-50/80',
  },
  indigo: {
    background: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-indigo-100',
  },
  red: {
    background: 'bg-gradient-to-br from-red-500 to-red-600',
    badge: 'bg-white/20 text-white',
    subtleText: 'text-rose-50/80',
  },
};

export const getTilePalette = (color: string): TilePalette => tilePalettes[color] || tilePalettes.blue;