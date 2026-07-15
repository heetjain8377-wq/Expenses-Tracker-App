const express = require("express");
const router = express.Router();
const {transaction, getAllTransaction, getDashboardStats, deleteTransaction, updateTransaction} = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-transaction", authMiddleware, transaction);
router.get("/", authMiddleware, getAllTransaction);
router.get("/dashboard", authMiddleware, getDashboardStats);
router.delete("/delete-transaction/:id", authMiddleware, deleteTransaction);
router.put("/update-transaction/:id", authMiddleware, updateTransaction);

module.exports = router;