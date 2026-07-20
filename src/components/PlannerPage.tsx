import React, { useState } from 'react';
import { FolderPlus, Plus } from 'lucide-react';
import { usePlanner } from '../hooks/usePlanner';
import { PlannerCategory, PlannerCategoryKind, PlannerItem } from '../types/Planner';
import PlannerHeroCard from './planner/PlannerHeroCard';
import PlannerChart from './planner/PlannerChart';
import CategorySection from './planner/CategorySection';
import CategoryFormModal from './planner/CategoryFormModal';
import ItemFormModal from './planner/ItemFormModal';

const PlannerPage: React.FC = () => {
  const {
    categories,
    metrics,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
  } = usePlanner();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PlannerCategory | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemCategory, setItemCategory] = useState<PlannerCategory | null>(null);
  const [editingItem, setEditingItem] = useState<PlannerItem | null>(null);

  const openAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (category: PlannerCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string, kind: PlannerCategoryKind) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, kind });
    } else {
      addCategory(name, kind);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Delete this category and all its items?')) {
      deleteCategory(id);
    }
  };

  const openAddItem = (category: PlannerCategory) => {
    setItemCategory(category);
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const openEditItem = (category: PlannerCategory, item: PlannerItem) => {
    setItemCategory(category);
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (name: string, amount: number) => {
    if (!itemCategory) return;
    if (editingItem) {
      updateItem(itemCategory.id, editingItem.id, name, amount);
    } else {
      addItem(itemCategory.id, name, amount);
    }
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (window.confirm('Delete this item?')) {
      deleteItem(categoryId, itemId);
    }
  };

  return (
    <>
      <div className="mb-8">
        <PlannerHeroCard
          totalMonthly={metrics.totalMonthly}
          expenseTotal={metrics.expenseTotal}
          investmentTotal={metrics.investmentTotal}
          investmentRate={metrics.investmentRate}
        />
      </div>

      <div className="mb-8">
        <PlannerChart items={metrics.itemBreakdown} totalMonthly={metrics.totalMonthly} />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
        <button
          type="button"
          onClick={openAddCategory}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 text-center">
          <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <FolderPlus className="w-7 h-7 text-white" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">No categories yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Create a category to start planning your monthly allocations
          </p>
          <button
            type="button"
            onClick={openAddCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pb-20">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onEditCategory={openEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddItem={openAddItem}
              onEditItem={openEditItem}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </div>
      )}

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        categoryName={itemCategory?.name ?? ''}
        item={editingItem}
      />

      <button
        type="button"
        onClick={openAddCategory}
        className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 hover:bg-blue-700 hover:shadow-xl hover:scale-105 sm:hidden"
        aria-label="Add category"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
};

export default PlannerPage;
