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


//monthly-summary
export const summury = async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const { month, year } = req.query;

    // Default to current month/year
    const now = new Date();
    const monthNum = month ? parseInt(month) - 1 : now.getMonth();
    const yearNum = year ? parseInt(year) : now.getFullYear();
    // console.log('monthNum', monthNum)
    // console.log('yearNum', yearNum)
    const startDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(yearNum, monthNum + 1, 1, 0, 0, 0));
    // console.log('startDate', startDate);
    // console.log('endDate', endDate)

    const summary = await Transaction.aggregate([
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
       {
        $sort: { totalSpent: -1, category: 1 } // <-- order by totalSpent descending, then category ascending
      }
    ]);

    res.json({ summary });
  } catch (err) {
    console.error(err);
    next(err)
  }
};