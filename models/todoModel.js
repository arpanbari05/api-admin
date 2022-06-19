const mongoose = require("mongoose");
const startOfDay = require("date-fns/startOfDay");
const endOfDay = require("date-fns/endOfDay");

const todoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
    validate: {
      validator: function (value) {
        return value > new Date().setHours(00, 00, 00);
      },
      message: "Due date should be greater than current time",
    },
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  tag: {
    type: String,
    required: [true, "Tag is required"],
    enum: {
      values: ["personal", "home", "office"],
      message: "Tag should either be personal or home or office",
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A todo must have a user"],
  },
});

todoSchema.pre(/^find/, function (next) {
  this.sort({ createdAt: -1 }).populate({
    path: "user",
  });

  next();
});

todoSchema.pre("aggregate", function (next) {
  this.sort({ createdAt: -1 });
  next();
});

const todoModel = mongoose.model("Todo", todoSchema);

module.exports = todoModel;
