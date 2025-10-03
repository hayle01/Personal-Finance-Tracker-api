import Transaction from "../models/transactions.js";

export const createTransaction = async (req, res, next) => {
  let { title, amount, type, category, date } = req.body;
  console.log(req.body, req.user);
  try {
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      createdBy: req.user._id,
    });
    res.status(201).json({
      message: "Transaction created",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
// get latest transactions
export const getLatestTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Transaction.find({ createdBy: userId })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// Get all transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const user = req.user._id;
    console.log("User", user);
    const transactions = await Transaction.find({ createdBy: user });
    if (!transactions) {
      return res.status(401).json({
        message: "No transactions Found",
      });
    }
    console.log("Transactins: ", transactions);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
// GET /transactions (supports period, search, category, type, sort, pagination)
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      period = "all",
      search = "",
      category = "all",
      type = "all",
      sort = "date_desc",
      page = 1,
      limit = 10,
    } = req.query;
    console.log("Query", req.query);

    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case "this_month":
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        break;
      case "last_month":
        startDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth() - 1, 1)
        );
        endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        break;
      case "this_year":
        startDate = new Date(Date.UTC(now.getFullYear(), 0, 1));
        endDate = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));
        break;
      case "all":
      default:
        startDate = null;
        endDate = null;
        break;
    }

    // Build query
    const query = { createdBy: userId };
    if (startDate && endDate) query.date = { $gte: startDate, $lt: endDate };
    if (search) query.title = { $regex: search, $options: "i" };
    if (category !== "all") query.category = category;
    if (type !== "all") query.type = type;

    // Sorting options
    let sortOption = {};
    switch (sort) {
      case "date_asc":
        sortOption = { date: 1 };
        break;
      case "amount_desc":
        sortOption = { amount: -1 };
        break;
      case "amount_asc":
        sortOption = { amount: 1 };
        break;
      case "title_asc":
        sortOption = { title: 1 };
        break;
      case "title_desc":
        sortOption = { title: -1 };
        break;
      case "date_desc":
      default:
        sortOption = { date: -1 };
        break;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // const transactions = await Transaction.find(query)
    //   .sort(sortOption)
    //   .skip(skip)
    //   .limit(limitNum);
    // const total = await Transaction.countDocuments(query);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      data: transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// update transaction
export const UpdateTransaction = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  console.log("Id", id, "user", user);
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, createdBy: user },
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(401).json({
        success: false,
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// delete transaction
export const deleteTransaction = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  try {
    const transaction = await Transaction.findByIdAndDelete({
      _id: id,
      createdBy: user,
    });
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const categories = await Transaction.distinct("category", {
      createdBy: userId,
    });

    res.status(200).json(categories.filter(Boolean));
  } catch (error) {
    next(error);
  }
};

// summary by period
export const summaryByPeriod = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period } = req.query;

    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate;

    switch (period) {
      case "this_month":
        startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

        prevStartDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth() - 1, 1)
        );
        prevEndDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        break;

      case "last_month":
        startDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth() - 1, 1)
        );
        endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

        prevStartDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth() - 2, 1)
        );
        prevEndDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth() - 1, 1)
        );
        break;

      case "this_year":
        startDate = new Date(Date.UTC(now.getFullYear(), 0, 1));
        endDate = new Date(Date.UTC(now.getFullYear() + 1, 0, 1));

        prevStartDate = new Date(Date.UTC(now.getFullYear() - 1, 0, 1));
        prevEndDate = new Date(Date.UTC(now.getFullYear(), 0, 1));
        break;

      case "all":
      default:
        startDate = new Date(0);
        endDate = new Date();
        prevStartDate = null;
        prevEndDate = null;
        break;
    }

    // total income & expense
    const aggregateTotals = async (s, e) => {
      if (!s || !e) return { income: 0, expense: 0 };

      const raw = await Transaction.aggregate([
        { $match: { createdBy: userId, date: { $gte: s, $lt: e } } },
        {
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      let income = 0;
      let expense = 0;
      raw.forEach((r) => {
        if (r._id === "income") income = r.totalAmount;
        if (r._id === "expense") expense = r.totalAmount;
      });
      return { income, expense };
    };

    // grouped by category
    const aggregateByCategory = async (s, e, type) => {
      if (!s || !e) return [];
      const raw = await Transaction.aggregate([
        {
          $match: {
            createdBy: userId,
            type,
            date: { $gte: s, $lt: e },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
          },
        },
        { $sort: { total: -1 } },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: "$total",
          },
        },
      ]);
      return raw;
    };

    const current = await aggregateTotals(startDate, endDate);
    const previous = await aggregateTotals(prevStartDate, prevEndDate);

    const expensesByCategory = await aggregateByCategory(
      startDate,
      endDate,
      "expense"
    );
    const incomesByCategory = await aggregateByCategory(
      startDate,
      endDate,
      "income"
    );

    // % change
    const calcChange = (curr, prev) => {
      if (prev === 0 && curr > 0) return 100;
      if (prev === 0 && curr === 0) return 0;
      return (((curr - prev) / prev) * 100).toFixed(1);
    };

    res.json({
      income: current.income,
      expense: current.expense,
      balance: current.income - current.expense,
      changes:
        period === "all"
          ? null
          : {
              income: calcChange(current.income, previous.income),
              expense: calcChange(current.expense, previous.expense),
              balance: calcChange(
                current.income - current.expense,
                previous.income - previous.expense
              ),
            },
      expensesByCategory,
      incomesByCategory,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
