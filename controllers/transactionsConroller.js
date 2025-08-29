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