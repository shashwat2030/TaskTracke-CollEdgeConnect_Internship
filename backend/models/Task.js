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
        values: ["Pending", "In-Progress", "Completed"],
        message: "{value} is invalid status",
      },
      default: "Pending",
      index: true, //optimizing status filtering
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{value} is invalid priority",
      },
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
TaskSchema.index({ status: 1, createdAt: -1 });
//compound index for status and createdAt for efficient filtering and sorting
module.exports = mongoose.model("Task", TaskSchema);
