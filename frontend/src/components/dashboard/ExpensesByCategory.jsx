import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#ef4444", "#f97316", "#facc15", "#8b5cf6", "#3b82f6", "#10b981"];

export const ExpensesByCategory = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="rounded-md shadow-none border border-border">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="flex flex-col items-center">
            {/* Donut chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <ul className="w-full mt-4 space-y-2">
              {data.map((d, i) => {
                const percent = ((d.value / total) * 100).toFixed(1);
                return (
                  <li key={i} className="flex py-2 border-b border-border items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-sm">{d.name}</span>
                    </div>
                    <span className="text-sm font-medium">{percent}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No expense data</p>
        )}
      </CardContent>
    </Card>
  );
};
