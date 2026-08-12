import React from 'react';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
