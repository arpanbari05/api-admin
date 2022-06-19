const express = require("express");
const { protect, checkRole } = require("../controllers/authController");
const {
  getAllTodos,
  createTodo,
  getTodo,
  deleteTodo,
  getMyTodos,
  updateTodo,
  getTodaysTodos,
  getArchivesTodo,
  getNotCompletedTodo,
  getLast7DaysTodo,
  getPrevWeekTodos,
  getAvgUserCalories,
} = require("../controllers/todoController");

const router = express.Router();

router
  .route("/")
  .get(protect, checkRole("admin"), getAllTodos)
  .post(protect, createTodo);
router.route("/my-todos").get(protect, getMyTodos);
router.route("/today").get(protect, getTodaysTodos);
router.route("/pending").get(protect, getNotCompletedTodo);
router.route("/archives").get(protect, getArchivesTodo);
router
  .route("/last-week-todos")
  .get(protect, checkRole("admin"), getLast7DaysTodo);
router
  .route("/prev-week-todos")
  .get(protect, checkRole("admin"), getPrevWeekTodos);
router
  .route("/avg-calories")
  .get(protect, checkRole("admin"), getAvgUserCalories);
router
  .route("/:id")
  .get(protect, getTodo)
  .delete(protect, deleteTodo)
  .patch(protect, updateTodo);
module.exports = router;
