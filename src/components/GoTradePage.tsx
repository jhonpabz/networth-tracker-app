import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGoTrade } from '../hooks/useGoTrade';
import GoTradeHeroCard from './gotrade/GoTradeHeroCard';
import GoTradeTransactionList from './gotrade/GoTradeTransactionList';
import AddGoTradeModal from './gotrade/AddGoTradeModal';

const GoTradePage: React.FC = () => {
  const { fxRate, totalPhp, totalUsd, transactions, setFxRate, addTransaction, deleteTransaction } =
    useGoTrade();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <GoTradeHeroCard
          totalPhp={totalPhp}
          totalUsd={totalUsd}
          fxRate={fxRate}
          transactionCount={transactions.length}
          onFxRateChange={setFxRate}
        />
      </div>

      <div className="mb-4">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Deposits</h2>
        <GoTradeTransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>

      <AddGoTradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTransaction}
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed z-40 flex items-center justify-center text-white transition-all duration-200 bg-blue-600 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 hover:bg-blue-700 hover:shadow-xl hover:scale-105"
        aria-label="Add deposit"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
};

export default GoTradePage;
