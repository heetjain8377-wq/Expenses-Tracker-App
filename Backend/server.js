require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", userRoutes);
app.use("/api/transaction", transactionRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});