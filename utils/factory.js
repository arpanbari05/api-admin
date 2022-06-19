const { catchAsync } = require("./helper");
const AppError = require("../utils/AppError");

exports.createDoc = (model) =>
  catchAsync(async (req, res, next) => {
    const data = await model.create(req.body);

    res.status(201).json({
      data,
    });
  });

exports.createManyDoc = (model) =>
  catchAsync(async (req, res, next) => {
    const data = await model.insertMany(req.body);

    res.status(201).json({
      data,
    });
  });

exports.deleteDoc = (model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await model.findByIdAndDelete(id);

    res.status(204).json({});
  });

exports.getDoc = (model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = await model.findById(id);

    if (!data) return next(new AppError("No data found with this ID", 422));

    res.status(200).json({
      data,
    });
  });

exports.getAllDocs = (model) =>
  catchAsync(async (req, res, next) => {
    const data = await model.find({});

    res.status(200).json({
      data,
    });
  });

exports.updateDoc = (model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const data = await model.findByIdAndUpdate(id, { ...req.body });

    res.status(200).json({
      data,
    });
  });
