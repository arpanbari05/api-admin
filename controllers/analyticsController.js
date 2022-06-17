const employeeModel = require("../models/employeeModel");
const { catchAsync } = require("../utils/helper");

exports.getTotalSales = catchAsync(async (req, res, next) => {
  const result = await employeeModel.aggregate([
    {
      $group: {
        _id: null,
        sumOfSales: { $sum: "$totalSales" },
      },
    },
  ]);

  res.status(200).json({
    data: result[0],
  });
});
