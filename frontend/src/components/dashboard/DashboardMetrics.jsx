import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const DashboardMetrics = ({ income, expense, balance, changes }) => {
  const metrics = [
    {
      label: "Balance",
      value: balance,
      color: "text-blue-600",
      change: changes.balance,
    },
    {
      label: "Incomes",
      value: income,
      color: "text-gray-900",
      change: changes.income,
    },
    {
      label: "Expenses",
      value: expense,
      color: "text-gray-900",
      change: changes.expense,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((m) => {
        const change = m.change;
        const hasChange = change !== null && change !== undefined && change !== 0;

        const isPositive = Number(change) >= 0;

        return (
          <Card key={m.label} className="relative rounded-md shadow">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${m.color}`}>
                ${m.value.toLocaleString()}
              </p>

              {hasChange && (
                <div className="absolute bottom-2 right-2">
                  <Badge
                    variant="outline"
                    className="flex items-center text-xs px-2 py-1 rounded font-medium">
                    {isPositive ? (
                      <ArrowUp className="h-3 w-3 mr-1 text-green-600" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1 text-destructive/70" />
                    )}
                    {change}%
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
