const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");

async function transaction(req,res){
    try{
        const {type, category, amount, description, transactionDate} = req.body;
        const user = await userModel.findOne({_id : req.user._id});

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        if(amount <= 0 || !amount){
            return res.status(404).json({
                message : "Amount is required"
            })
        }

        const transaction = await transactionModel.create({
            userId : req.user._id,
            type,
            category,
            amount,
            description,
            transactionDate,
            user
        })

        res.status(200).json({
            success : true,
            message : "Transaction created successfully",
            transaction
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
};

async function getAllTransaction(req,res){
    try{
        const user = await userModel.findOne({_id : req.user._id});

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        const transactions = await transactionModel.find({userId : req.user._id})
        .sort({transactionDate : -1})

        res.status(200).json({
            success : true,
            message : "Transactions fetched successfully",
            transactions
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
};

async function getDashboardStats(req,res){
    try{
        const transactions = await transactionModel.find({userId : req.user._id});

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
            if(transaction.type === "Income"){
                totalIncome += transaction.amount;
            }else if(transaction.type === "Expense"){
                totalExpense += transaction.amount;
            }
        });

        const balance = totalIncome-totalExpense;

        const categoryTotals = {};

        transactions.forEach(transaction => {
            if(transaction.type === "Expense"){
                if(categoryTotals[transaction.category]){
                    categoryTotals[transaction.category] += transaction.amount;
                }else{
                    categoryTotals[transaction.category] = transaction.amount;
                }
            }
        })

        return res.status(200).json({
            success : true,
            totalIncome,
            totalExpense,
            balance,
            categoryTotals
        });
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
};

async function deleteTransaction(req,res){
    try{
        const id = req.params.id;

        const transaction = await transactionModel.findByIdAndDelete(id);

        res.status(200).json({
            success : true,
            message : "Transaction Deleted Successfully"
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
};

async function updateTransaction(req,res){
    try{
        const {type, category, amount, description, transactionDate} = req.body;

        if(!type || !category || !amount || !description || !transactionDate){
            return res.status(404).json({
                message : "All fields are required"
            })
        }

        const id = req.params.id;
        const transaction =  await transactionModel.findById(id);

        if(!transaction){
            return res.status(404).json({
                message : "Transaction not found"
            })
        }

        if(transaction.userId.toString() !== req.user._id){
            return res.status(403).json({
                message : "Unauthorized"
            })
        }

        transaction.type = type;
        transaction.category = category;
        transaction.amount = amount;
        transaction.description = description;
        transaction.transactionDate = transactionDate;

        await transaction.save();

        return res.status(200).json({
            success : true,
            message : "Transaction updated successfully",
            transaction
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : error.message
        })
    }
};

module.exports ={transaction, getAllTransaction, getDashboardStats, deleteTransaction, updateTransaction};