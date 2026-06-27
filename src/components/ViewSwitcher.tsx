import React from 'react';

interface ViewSwitcherProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function ViewSwitcher<T extends string>({ options, value, onChange }: ViewSwitcherProps<T>) {
  return (
    <div className="flex items-center p-1 bg-gray-100 rounded-full dark:bg-gray-800">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            value === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ViewSwitcher;
