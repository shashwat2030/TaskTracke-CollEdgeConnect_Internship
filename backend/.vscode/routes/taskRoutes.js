const express = require("express");
const router = express.Router();
const validateTask = require("../middlewares/validateTask");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

//Collective Resource Sharing Endpoint Mapping
router.route("/").get(getTasks).post(validateTask, createTask);

//Isolated Singular Resource Endpoint Mapping

router
  .route("/:id")
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);
module.exports = router;
