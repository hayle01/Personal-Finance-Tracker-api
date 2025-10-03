import { TransactionRow } from "./TransactionRow";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const TransactionsList = ({
  transactions = [],
  onEdit,
  selectedPeriod,
  title,
  description,
  compact = false
}) => {
  const showHeader = !compact && title && description;

  return (
    <Card
      variant="outline"
      className={`rounded-md border border-border ${compact ? "p-0" : ""}`}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader className="px-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-md text-gray-500">{description}</CardDescription>
        </CardHeader>
      )}

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">No Transactions Found</p>
        </div>
      ) : (
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className={`font-medium ${
                showHeader ? "bg-gray-100 border-y border-border" : "text-gray-800"
              }`}
            >
              <tr className="text-md text-gray-600">
                <td className="px-4 py-2 text-left">Date</td>
                <td className="px-4 py-2 text-left">Title</td>
                <td className="px-4 py-2 text-left">Type</td>
                <td className="px-4 py-2 text-left">Category</td>
                <td className="px-4 py-2 text-left">Amount</td>
                <td className="px-4 py-2 text-center">Actions</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <TransactionRow
                  key={tx._id || tx.date + tx.title}
                  transaction={tx}
                  onEdit={onEdit}
                  selectedPeriod={selectedPeriod}
                />
              ))}
            </tbody>
          </table>
        </CardContent>
      )}
    </Card>
  );
};
