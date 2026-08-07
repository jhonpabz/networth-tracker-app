import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDragonfiFund } from '../hooks/useDragonfiFund';
import DragonfiFundHeroCard from './dragonfi-fund/DragonfiFundHeroCard';
import DragonfiFundTransactionList from './dragonfi-fund/DragonfiFundTransactionList';
import AddDragonfiFundModal from './dragonfi-fund/AddDragonfiFundModal';

const DragonfiFundPage: React.FC = () => {
  const { totalPhp, transactions, addTransaction, deleteTransaction } = useDragonfiFund();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <DragonfiFundHeroCard totalPhp={totalPhp} transactionCount={transactions.length} />
      </div>

      <div className="mb-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Deposits</h2>
        <DragonfiFundTransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>

      <AddDragonfiFundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTransaction}
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-zinc-900 shadow-2xl transition-transform hover:scale-105 hover:bg-amber-300 active:scale-95 sm:right-8"
        aria-label="Add deposit"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>
    </>
  );
};

export default DragonfiFundPage;
