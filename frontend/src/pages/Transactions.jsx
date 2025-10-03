import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import api from "@/lib/api/apiClient";
import { TransactionsList } from "../components/dashboard/TransactionsList";
import { AddTransactionForm } from "../components/dashboard/AddTransactionForm";
import { TransactionsFilters } from "../components/dashboard/TransactionsFilters";

const periods = ["all", "this_month", "last_month", "this_year"];
const types = ["all", "income", "expense"];
const toTitleCase = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const Transactions = () => {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("this_month");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("date_desc");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const limit = 10;

  // Fetch transactions
  const queryKey = ["transactions", { period, search, category, type, sort, page }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/transactions", {
        params: { period, search, category, type, sort, page, limit },
      });
      return res.data;
    },
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome and create transaction section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium">Transactions</h1>
          <p className="text-muted-foreground">
            View, search, and manage all your income and expenses in one place.
          </p>
        </div>
        <div className="">
          <Button
            variant="default"
            className="cursor-pointer rounded"
            onClick={() => setShowForm(true)}>
            Create Transaction
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TransactionsFilters
        search={search}
        setSearch={setSearch}
        period={period}
        setPeriod={setPeriod}
        type={type}
        setType={setType}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
      />

      {/* Transactions Table */}
      <TransactionsList
        transactions={transactions}
        onEdit={(tx) => {
          setEditingTransaction(tx);
          setShowForm(true);
        }}
        selectedPeriod={period}
        queryKey={queryKey}    
      />

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Add/Edit Form */}
      <AddTransactionForm
        transaction={editingTransaction}
        open={showForm || !!editingTransaction}
        onOpenChange={handleCloseForm}
      />
    </div>
  );
};
