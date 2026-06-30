const Task = require("../models/Task");

//@desc Get all tasks with filtering ,sorting, and text searching
//@ route GET/api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, search } = req.query;
    const queryCondition = {};

    // Filtering Logic
    if (status) {
      queryCondition.status = status;
    }
    if (priority) {
      queryCondition.priority = priority;
    }
    // bonus :Case-insensitive title search engine
    if (search) {
      queryCondition.title = { $regex: search, $options: "i" };
    }
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "dueDate") sortOption = { dueDate: 1 };

    const tasks = await Task.find(queryCondition).sort(sortOption);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

// @desc Get a single task by ID
// @route GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

//@desc Create a new task (Protected against Mass-Assignment)
//@route POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    // Explicitly destructure to whitelist acceptable payload fields
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc Update an existing task safely
//@route PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    // Explicitly destructure to whitelist acceptable payload fields
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task resource not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// desc Delete a task by ID
// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task resource  not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
