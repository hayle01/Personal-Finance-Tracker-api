import { Button } from "@/components/ui/button";
const toTitleCase = (str) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const DashboardWelcome = ({
  onCreateTransaction,
  period,
  onPeriodChange,
}) => {
  const periods = ["all", "this_month", "last_month", "this_year"];
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left side: welcome message */}
      <div>
        <h1 className="text-lg font-medium">Your finances, simplified</h1>
        <p className="text-muted-foreground">
          Easily track, analyze, and grow your money
        </p>
      </div>

      {/* Right side: controls */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Period selector */}
        <div className="inline-flex overflow-hidden">
          {periods.map((p) => (
            <Button
              key={p}
              variant={period === p ? "secondary" : "outline"}
              className="cursor-pointer -ml-px first:ml-0 rounded-none first:rounded-l last:rounded-r"
              onClick={() => onPeriodChange(p)}>
              {toTitleCase(p)}
            </Button>
          ))}
        </div>

        {/* Add transaction button */}
        <Button
          variant="default"
          className="cursor-pointer rounded"
          onClick={onCreateTransaction}>
          Create Transaction
        </Button>
      </div>
    </div>
  );
};
