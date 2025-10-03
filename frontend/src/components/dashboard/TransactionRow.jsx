import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../lib/api/apiClient";

export const TransactionRow = ({ transaction, onEdit, selectedPeriod, queryKey }) => {

  const { date, title,amount, category, type, _id } = transaction;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();

  // TODO: Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/transactions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Transaction deleted successfully.");
      queryClient.invalidateQueries({
        queryKey
      });
      queryClient.invalidateQueries({ queryKey: ["summary", selectedPeriod] });
    },
    onError: () => {
      toast.error("Failed to delete transaction.");
    },
  });

  const handleConfirmDelete = () => {
    try {
      console.log("Transaction to delete:", transaction);
      console.log("Deleting transaction id:", transaction._id);
      deleteMutation.mutateAsync(_id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete the task. Please try again.");
    }
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50 cursor-pointer">
        <td className="px-4 py-2">{new Date(date).toLocaleDateString()}</td>
        <td className="px-4 py-2">{title}</td>
        <td className="px-4 py-2">{type}</td>
        <td className="px-4 py-2">{category}</td>
        <td className="px-4 py-2">
          <span
            className={type === "income" ? "text-green-500" : "text-red-500"}>
            {type === "income" ? `+$${amount}` : `-$${amount}`}
          </span>
        </td>
        <td className="px-4 py-2 text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction <span className="font-medium">"{title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleteMutation.isLoading}>
              {deleteMutation.isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
