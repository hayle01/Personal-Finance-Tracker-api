import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";

import { AddTransactionForm } from "../components/dashboard/AddTransactionForm";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { DashboardWelcome } from "../components/dashboard/DashboardWelcome ";
import { ExpensesByCategory } from "../components/dashboard/ExpensesByCategory";
import { TransactionsList } from "../components/dashboard/TransactionsList";
import api from "../lib/api/ApiClient";

export const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");

  const queryClient = useQueryClient();
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

  // fetch latest transactions
  const transactionsQuery = useQuery({
    queryKey: ["transactions", selectedPeriod],
    queryFn: async () => {
      const response = await api.get("/transactions/latest?limit=7");
      return response.data;
    },
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/transactions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Transaction deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["transactions", selectedPeriod],
      });
      queryClient.invalidateQueries({ queryKey: ["summary", selectedPeriod] }); 
    },
    onError: () => {
      toast.error("Failed to delete transaction.");
    },
  });

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingTransaction(null);
  };

  const handleOnCreateTransaction = () => {
    setShowCreateForm(true);
  };

  const handleEdit = (transaction) => console.log("Edit:", transaction);

  const handleDelete = (transaction) => {
    console.log("Transaction to delete:", transaction);
    console.log("Deleting transaction id:", transaction._id);
    deleteMutation.mutate(transaction._id);
  };

  if (summaryQuery.isLoading || transactionsQuery.isLoading) {
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
          balance={summaryQuery.data?.balance || 0}
          changes={
            summaryQuery.data?.changes || { income: 0, expense: 0, balance: 0 }
          }
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Expenses By Category */}
          <div className="col-span-1">
            <ExpensesByCategory
              data={summaryQuery.data?.expensesByCategory || []}
            />
          </div>

          {/* Latest Transactions */}
          <div className="col-span-1 md:col-span-2">
            {transactionsQuery.data && (
              <TransactionsList
                transactions={transactionsQuery.data || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedPeriod={selectedPeriod}
              />
            )}
          </div>
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
