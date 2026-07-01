
/* eslint-disable */
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Required Title"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 character"],
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },
        status: {
            type: String,
            enum: {
                // Ye 3 values ekdum exact lowercase mein honi chahiye
                values: ["pending", "in-progress", "complete"],
                message: "{value} is invalid status",
            },
            default: "pending",
            index: true,
            lowercase: true, // <--- Ye line mandatory hai
            trim: true,      // <--- Ye line extra safe hai
        },
        priority: {
            type: String,
            enum: {
                values: ["low", "medium", "high"],
                message: "{value} is invalid priority",
            },
            default: "medium",
            lowercase: true,
            trim: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

TaskSchema.index({ status: 1, createdAt: -1 });
module.exports = mongoose.model("Task", TaskSchema);