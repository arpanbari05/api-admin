const todoModel = require("../models/todoModel");
const { getAllDocs, getDoc, deleteDoc } = require("../utils/factory");
const { catchAsync } = require("../utils/helper");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");

exports.getAllTodos = getAllDocs(todoModel);
exports.getTodo = getDoc(todoModel);
exports.deleteTodo = deleteDoc(todoModel);

exports.updateTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const completedAt = req.body.isCompleted ? Date.now() : null;

  await todoModel.findByIdAndUpdate(id, {
    ...req.body,
    completedAt,
  });

  res.status(204).json({});
});

exports.createTodo = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const todo = await todoModel.create({ ...req.body, user: _id });

  res.status(201).json({
    todo,
  });
});

exports.getMyTodos = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const todos = await todoModel.find({ user: _id });

  res.status(200).json({
    todos,
  });
});

exports.getTodaysTodos = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const todos = await todoModel.aggregate([
    {
      $match: {
        user: _id,
        $or: [
          {
            completedAt: {
              $gte: startOfDay(new Date()),
              $lte: endOfDay(new Date()),
              $ne: null,
            },
          },
          {
            dueDate: {
              $gte: startOfDay(new Date()),
              $lte: endOfDay(new Date()),
              $ne: null,
            },
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    todos,
  });
});

exports.getArchivesTodo = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const todos = await todoModel.find({
    isCompleted: true,
    user: _id,
  });

  res.status(200).json({
    todos,
  });
});

exports.getNotCompletedTodo = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const todos = await todoModel.find({ isCompleted: false, user: _id });

  res.status(200).json({
    todos,
  });
});

exports.getLast7DaysTodo = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const weekAgoDate = startOfDay(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );

  const todos = await todoModel.aggregate([
    {
      $match: {
        user: _id,
        createdAt: {
          $gte: weekAgoDate,
        },
      },
    },
  ]);

  res.status(200).json({
    todos,
  });
});

exports.getPrevWeekTodos = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const prevWeekStartDate = startOfDay(
    new Date(new Date().setDate(new Date().getDate() - 14))
  );
  const prevWeekEndDate = endOfDay(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );

  console.log({
    prev: prevWeekEndDate.toDateString(),
    prev: prevWeekStartDate.toDateString(),
  });

  const todos = await todoModel.aggregate([
    {
      $match: {
        user: _id,
        createdAt: {
          $gte: prevWeekStartDate,
          $lte: prevWeekEndDate,
        },
      },
    },
  ]);

  res.status(200).json({
    todos,
  });
});

exports.getAvgUserCalories = catchAsync(async (req, res, next) => {
  const weekAgoDate = startOfDay(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );

  const todos = await todoModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: weekAgoDate,
        },
      },
    },
    {
      $group: {
        _id: "$user",
        user: { $push: "$user" },
        caloriesAvg: { $sum: 1 },
      },
    },
  ]);

  await todoModel.populate(todos, { path: "user", select: "-password" });

  res.status(200).json({
    todos,
  });
});
