import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ListFilter, Calendar, Search, ArrowUpDown } from "lucide-react";

const periods = [
  { value: "all", label: "All Time" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
];

const types = ["all", "income", "expense"];

const sortOptions = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "amount_desc", label: "Amount High → Low" },
  { value: "amount_asc", label: "Amount Low → High" },
  { value: "title_asc", label: "Title A → Z" },
  { value: "title_desc", label: "Title Z → A" },
];

export function TransactionsFilters({
  search,
  setSearch,
  period,
  setPeriod,
  type,
  setType,
  category,
  setCategory,
  sort,
  setSort,
}) {
  
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("transactions/categories");
      console.log("Categories: ", res)
      return res.data;
    },
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category"
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
      {/* Period */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex cursor-pointer items-center gap-2">
            <Calendar className="h-4 w-4" />
            {periods.find((p) => p.value === period)?.label || "Period"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Period</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {periods.map((p) => (
            <DropdownMenuItem className="cursor-pointer" key={p.value} onClick={() => setPeriod(p.value)}>
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Type */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex cursor-pointer items-center gap-2">
            <Filter className="h-4 w-4" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {types.map((t) => (
            <DropdownMenuItem className="cursor-pointer" key={t} onClick={() => setType(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex cursor-pointer items-center gap-2">
            <Filter className="h-4 w-4" />
            {category === "all" ? "Category" : category}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCategory("all")}>All</DropdownMenuItem>
          {categories?.map((c) => (
            <DropdownMenuItem className="cursor-pointer" key={c} onClick={() => setCategory(c)}>
              {c}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort */}
      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="flex cursor-pointer items-center gap-2">
      <ArrowUpDown className="h-4 w-4"/>
      {sortOptions.find(s => s.value === sort)?.label || "Sort"}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {sortOptions.map((s) => (
      <DropdownMenuItem
        className="cursor-pointer"
        key={s.value}
        onClick={() => setSort(s.value)}
      >
        {s.label}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>

      </div>
    </div>
  );
}
