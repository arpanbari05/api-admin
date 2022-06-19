const mongoose = require("mongoose");

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
  this.populate({
    path: "user",
  });

  next();
});

const todoModel = mongoose.model("Todo", todoSchema);

module.exports = todoModel;
