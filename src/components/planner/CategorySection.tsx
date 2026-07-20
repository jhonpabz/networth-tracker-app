import React from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PlannerCategory, PlannerItem } from '../../types/Planner';
import { computeCategoryTotal } from '../../utils/plannerCalculations';
import { formatCurrency } from '../../utils/formatCurrency';

interface CategorySectionProps {
  category: PlannerCategory;
  onEditCategory: (category: PlannerCategory) => void;
  onDeleteCategory: (id: string) => void;
  onAddItem: (category: PlannerCategory) => void;
  onEditItem: (category: PlannerCategory, item: PlannerItem) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const total = computeCategoryTotal(category);
  const kindLabel = category.kind === 'investment' ? 'Investment / Savings' : 'Expense';

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700/50">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {category.name}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                category.kind === 'investment'
                  ? 'text-blue-400 bg-blue-400/10'
                  : 'text-orange-400 bg-orange-400/10'
              }`}
            >
              {kindLabel}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {formatCurrency(total)} · {category.items.length}{' '}
            {category.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onAddItem(category)}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            aria-label={`Add item to ${category.name}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={`Edit ${category.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory(category.id)}
            className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label={`Delete ${category.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {category.items.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No items yet</p>
          <button
            type="button"
            onClick={() => onAddItem(category)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add first item
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700/40">
          {category.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(item.amount)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEditItem(category, item)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteItem(category.id, item.id)}
                  className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategorySection;
