import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    category: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ createdBy: 1, date: -1 });
transactionSchema.index({ createdBy: 1, category: 1 });
transactionSchema.index({ createdBy: 1, type: 1 });
transactionSchema.index({ createdBy: 1, title: 1 });


const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
