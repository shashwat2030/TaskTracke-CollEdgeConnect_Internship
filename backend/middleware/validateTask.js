const validateTask = (req, res, next) => {
  const { title, dueDate, status, priority } = req.body;
  const validStatus = ["Pending", "In-Progress", "Completed"];

  // title presence and empty string check
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Required title and should be non-empty",
    });
  }
  // title length boundary check
  if (title.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "Title should not exceed 100 characters",
    });
  }

  //optional dueDate validation
  if (dueDate) {
    const parsedDate = Date.parse(dueDate);
    if (isNaN(parsedDate)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid dueDate format" });
    }
  }
  if (status && !validStatus.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status value" });
  }
  next();
};
module.exports = validateTask;
