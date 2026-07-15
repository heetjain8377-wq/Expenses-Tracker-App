const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    type : {
        type : String,
        enum : ["Income", "Expense"]
    },
    category : {
        type : String,
        enum : ["Food", "Shopping", "Travel", "Bills", "Entertainment", "Salary", "Freelancing", "Health", "Education", "Investment", "Other"],
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    description : {
        type : String
    },
    transactionDate : {
        type : Date,
        required : true
    }
},{
    timestamps : true
});

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;