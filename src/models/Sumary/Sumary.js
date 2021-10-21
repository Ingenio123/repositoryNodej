const { Schema } = require("mongoose");

const SumarySchema = new Schema({
  id_Student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  id_Course: {
    type: Schema.Types.ObjectId,
    ref: "Courses",
  },
});

module.exports = model("summary", SumarySchema);
