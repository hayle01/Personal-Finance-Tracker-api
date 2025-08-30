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