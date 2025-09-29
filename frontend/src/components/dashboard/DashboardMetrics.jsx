import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardMetrics = ({ income, expense }) => {
  const balance = income - expense;

  const metrics = [
    { label: "Balance", value: balance, color: "text-blue-600" },
    { label: "Income", value: income, color: "text-green-600" },
    { label: "Expense", value: expense, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <Card key={m.label} className="rounded-md shadow">
          <CardHeader>
            <CardTitle className="text-md text-muted-foreground">{m.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${m.color}`}>
              ${m.value.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
