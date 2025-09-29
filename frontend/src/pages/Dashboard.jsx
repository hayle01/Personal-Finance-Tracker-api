import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import { AddTransactionForm } from "../components/dashboard/AddTransactionForm";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { ExpensesByCategory } from "../components/dashboard/ExpensesByCategory";
import { DashboardWelcome } from "../components/dashboard/DashboardWelcome ";
import api from "../lib/api/ApiClient";
import { IncomesByCategory } from "../components/dashboard/IncomesByCategory";

export const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");

  // fetch summary by period
  const summaryQuery = useQuery({
    queryKey: ["summary", selectedPeriod],
    queryFn: async () => {
      const res = await api.get(
        `/transactions/summary?period=${selectedPeriod}`
      );
      return res.data;
    },
    retry: 1,
  });

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingTransaction(null);
  };

  const handleOnCreateTransaction = () => {
    setShowCreateForm(true);
  };

  if (summaryQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-6">
        <DashboardWelcome
          onCreateTransaction={handleOnCreateTransaction}
          period={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        {/* Metrics Section */}
        <DashboardMetrics
          income={summaryQuery.data?.income || 0}
          expense={summaryQuery.data?.expense || 0}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExpensesByCategory
            data={summaryQuery.data?.expensesByCategory || []}
          />
          <IncomesByCategory
            data={summaryQuery.data?.incomesByCategory || []}
          />
        </div>
      </main>

      <AddTransactionForm
        transaction={editingTransaction}
        open={showCreateForm || !!editingTransaction}
        onOpenChange={handleCloseForm}
      />
    </>
  );
};
