const mongoose = require("mongoose");

const newFeedback = new mongoose.Schema({
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  classSummary: {
    type: String,
  },
  comments: {
    type: String,
  },
  idiom: {
    type: String,
    required: true,
  },
  levels: [
    {
      level_ID: {
        type: String,
      },
      sublevel_ID: {
        type: String,
      },
      conten_ID: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("FeedBack", newFeedback);
