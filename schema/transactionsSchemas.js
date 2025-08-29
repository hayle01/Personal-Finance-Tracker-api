import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number"
  }),
  type: z.enum(["income", "expense"], {
    required_error: "Type is required",
    invalid_type_error: "Type must be either 'income' or 'expense'"
  }),
  category: z.string().optional(),
  date: z.preprocess(
    (val) => (val ? new Date(val) : new Date()),
    z.date()
  )
});
