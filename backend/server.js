const express = require("express");
const cors = require("cors");
const path=require("path");// important missing line
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
 const frontendPath=path.join(__dirname,"dist");
 app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath,"index.html"));
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
