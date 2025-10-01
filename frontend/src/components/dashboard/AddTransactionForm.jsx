import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api/apiClient";
import { Loader } from "lucide-react";
import { extractErrorMessages } from "../../utils/errorUtils";

// Transaction types
const TRANSACTION_TYPES = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

//initialize form values
const getInitialFormValues = (transaction) => ({
  title: transaction?.title || "",
  amount: transaction?.amount || "",
  type: transaction?.type || "expense",
  category: transaction?.category || "",
  date: transaction?.date
    ? new Date(transaction.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
});

export const AddTransactionForm = ({
  transaction = null,
  open = false,
  onOpenChange,
}) => {
  const [formValues, setFormValues] = useState(
    getInitialFormValues(transaction)
  );
  const [validationError, setValidationError] = useState(null);
  const queryClient = useQueryClient();


  useEffect(() => {
    setFormValues(getInitialFormValues(transaction));
    setValidationError(null);
  }, [transaction, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setFormValues((prev) => ({ ...prev, type: value }));
  };

  const handleCancel = () => {
    setFormValues(getInitialFormValues(null));
    onOpenChange?.(false);
  };

  // TODO: Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData) => {
      const response = await api.post("/transactions", transactionData);
      return response.transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      toast.success("Transaction created successfully.");
      onOpenChange?.(false);
      setFormValues(getInitialFormValues(null));
    },
    onError: (error) => {
      const msg = extractErrorMessages(error);
      setValidationError(msg);
      toast.error(`Error creating transaction: ${msg}`, {
        description: "Please try again.",
      });
    },
  });

  // TODO: Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ tx_Id, transData }) => {
      const response = await api.put(`/transactions/${tx_Id}`, transData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      toast.success("Transaction updated successfully.");
      onOpenChange?.(false);
    },
    onError: (error) => {
      const msg = extractErrorMessages(error);
      setValidationError(msg);
      toast.error(`Error updating transaction: ${msg}`, {
        description: "Please try again.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!formValues.title.trim()) {
      setValidationError("Title is required.");
      return;
    }
    if (!formValues.amount || Number(formValues.amount) <= 0) {
      setValidationError("Amount must be greater than 0.");
      return;
    }

    const transData = {
      title: formValues.title.trim(),
      amount: Number(formValues.amount),
      type: formValues.type,
      category: formValues.category,
      date: formValues.date
        ? new Date(formValues.date).toISOString()
        : new Date().toISOString(),
    };

    if (transaction?._id) {
      updateTransactionMutation.mutate({ tx_Id: transaction._id, transData });
    } else {
      createTransactionMutation.mutate(transData);
    }
  };

  const isLoading =
    createTransactionMutation.isLoading || updateTransactionMutation.isLoading;

  const displayError = validationError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {transaction ? "Edit Transaction" : "Create New Transaction"}
          </DialogTitle>
          <DialogDescription>Fill in details below the form</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {displayError}
            </div>
          )}
          {/* Title */}
          <div className="space-y-2">
            <Label>
              Title<span className="text-destructive">*</span>
            </Label>
            <Input
              name="title"
              value={formValues.title}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Amount */}
            <div className="flex-1 space-y-2">
              <Label>
                Amount<span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                name="amount"
                value={formValues.amount}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
              />
            </div>

            {/* Type */}
            <div className="flex-1 space-y-2">
              <Label>Type</Label>
              <Select value={formValues.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              name="category"
              value={formValues.category}
              onChange={handleChange}
              placeholder="e.g., Food, Salary, etc."
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  {transaction ? "Updating..." : "Creating..."}
                </span>
              ) : transaction ? (
                "Update Transaction"
              ) : (
                "Create Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
