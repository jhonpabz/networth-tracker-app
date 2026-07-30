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
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-zinc-900 shadow-2xl transition-transform hover:scale-105 hover:bg-amber-300 active:scale-95 sm:right-8"
        aria-label="Add deposit"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>
    </>
  );
};

export default GoTradePage;
