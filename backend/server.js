const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

// connect db establishing safe database pipeline
connectDB();

const app = express();

//Global Network Resource Policies
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);
app.use(express.json());

// Application API route mounting
app.use("/api/tasks", taskRoutes);

// base cluster health diagnostic route
app.get("/", (req, res) => {
    res
        .status(200)
        .json({success: true, status: "Healthy", engine: "Node.js Express 5"});
});

// System Error Pipeline Fallback Interceptor (Must reside at final execution  position )
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `[Engine]:Core system actively processing allocations on port ${PORT}`,
    );
});
