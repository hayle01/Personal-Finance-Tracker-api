import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    amount: {type: Number, required: true},
    type: {
        type: String,
        enum: ['income', 'expense']
    },
    category: String,
    date:Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true}
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction;