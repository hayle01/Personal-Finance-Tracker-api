import User from "../models/users.js"
import Transaction from "../models/transactions.js"

export const overview = async (req, res, next) => {
    try {
        // Total users
        const totalUsers = await User.countDocuments();
        // console.log('total users', totalUsers)
        // Total transactions
        const totalTransactions = await Transaction.countDocuments();
        // Total income & expenses
        const totals = await Transaction.aggregate([
            {$group: {
                _id: '$type',
               totalAmount: { $sum: "$amount" }
            }}
        ])
        let totalIncomes = 0;
        let totalExpenses = 0;
        totals.forEach((t) => {
            if(t._id === "income") totalIncomes = t.totalAmount;
            if(t._id === "expense") totalExpenses = t.totalAmount; 
        })
        // top spending categories
        const topSpendingCategories = await Transaction.aggregate([
            {$match: {type: "expense"}},
            {$group: {
                _id: "$category",
                totalSpent: {$sum: "$amount"}
            }},
            {$sort: {totalSpent: -1}},
            {$limit: 5},
            {$project: {
                _id:0,
                category: "$_id",
                totalSpent: 1
            }}
        ])
        res.json({
            totalUsers,
            totalTransactions,
            totalIncomes,
            totalExpenses,
            topSpendingCategories
        });
    } catch (error) {
        next(error)
    }
}