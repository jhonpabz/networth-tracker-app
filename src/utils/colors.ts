export const colorOptions = [
  { name: 'Emerald', value: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
  { name: 'Blue', value: 'blue', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Purple', value: 'purple', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Orange', value: 'orange', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Pink', value: 'pink', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Teal', value: 'teal', gradient: 'from-teal-500 to-teal-600' },
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
    teal: 'bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    red: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
  };
  return colorMap[color] || colorMap.blue;
};