import React, { useState } from "react";
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


export const TransactionRow = ({ transaction, onEdit, onDelete, selectedPeriod }) => {

  console.log("Selected Period in TransactionRow:", selectedPeriod);

  const { date, title, amount, category, type, _id } = transaction;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  const handleConfirmDelete = () => {
    onDelete(transaction);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50 cursor-pointer">
        <td className="px-4 py-2">{new Date(date).toLocaleDateString()}</td>
        <td className="px-4 py-2">{title}</td>
        <td className="px-4 py-2">{category}</td>
        <td className="px-4 py-2">
          <span className={type === "income" ? "text-green-500" : "text-red-500"}>
            {type === "income" ? `+$${amount}` : `-$${amount}`}
          </span>
        </td>
        <td className="px-4 py-2">
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
              This action cannot be undone. This will permanently delete the transaction <span className="font-medium">"{title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={onDelete.isLoading}
            >
              {onDelete.isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};