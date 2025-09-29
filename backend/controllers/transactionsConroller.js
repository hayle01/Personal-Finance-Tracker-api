import Transaction from '../models/transactions.js';

export const createTransaction = async (req, res, next) => {
    let { title, amount, type, category, date} = req.body;
    console.log(req.body, req.user);
    try {
        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            date,
            createdBy: req.user._id
        })
        res.status(201).json({
            message: 'Transaction created',
            transaction
        })
    } catch (error) {
        next(error)
    }
}

// Get all transactions
export const getAllTransactions = async (req, res, next) => {
    try {
        const user = req.user._id;
        console.log('User', user);
        const transactions = await Transaction.find({createdBy: user});
        if(!transactions){
            return res.status(401).json({
                message: "No transactions Found"
            })
        }
        console.log('Transactins: ', transactions)
        res.status(200).json(transactions);
    } catch (error) {
        next(error)
    }
}

// update transaction
export const UpdateTransaction = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user._id;
    console.log('Id', id, 'user', user)
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {_id: id, createdBy: user},
            req.body,
            {new: true}
        );
        if(!transaction){
            return res.status(401).json({
                success: false,
                message: "Transaction not found"
            })
        }
        res.status(200).json({
          success: true,
          data: transaction
        })
    } catch (error) {
        next(error)
    }
}

// delete transaction
export const deleteTransaction = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user._id;
    try {
        const transaction = await Transaction.findByIdAndDelete(
            {_id: id, createdBy: user}
        )
        if(!transaction){
            return res.status(404).json({
                message: "Transaction not found"
            })
        }
        res.status(200).json({
            message: "Transaction deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

// summary by period
export const summaryByPeriod = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period } = req.query;

    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case "this_month":
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
        endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0));
        break;

      case "last_month":
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0));
        endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0));
        break;

      case "this_year":
        startDate = new Date(Date.UTC(now.getFullYear(), 0, 1, 0, 0, 0));
        endDate = new Date(Date.UTC(now.getFullYear() + 1, 0, 1, 0, 0, 0));
        break;

      case "all":
      default:
        startDate = new Date(0);
        endDate = new Date(); 
        break;
    }

    const raw = await Transaction.aggregate([
      {
        $match: {
          createdBy: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          totals: {
            $push: { type: "$_id.type", amount: "$totalAmount" },
          },
        },
      },
      {
        $project: {
          category: "$_id",
          _id: 0,
          totalSpent: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$totals",
                    cond: { $eq: ["$$this.type", "expense"] },
                  },
                },
                as: "t",
                in: "$$t.amount",
              },
            },
          },
          totalEarned: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$totals",
                    cond: { $eq: ["$$this.type", "income"] },
                  },
                },
                as: "t",
                in: "$$t.amount",
              },
            },
          },
        },
      },
    ]);

    // Reshape for frontend
let income = 0;
let expense = 0;
const expensesByCategory = [];
const incomesByCategory = [];

raw.forEach((row) => {
  income += row.totalEarned;
  expense += row.totalSpent;

  if (row.totalSpent > 0) {
    expensesByCategory.push({ name: row.category, value: row.totalSpent });
  }
  if (row.totalEarned > 0) {
    incomesByCategory.push({ name: row.category, value: row.totalEarned });
  }
});

res.json({ income, expense, expensesByCategory, incomesByCategory });

  } catch (err) {
    console.error(err);
    next(err);
  }
};
