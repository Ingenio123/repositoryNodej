const { Schema, model } = require("mongoose");

const SumarySchema = new Schema(
  {
    id_Student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    id_Course: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    id_Teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      classSummary: {
        type: String,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: () => {
          return new Date();
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Summary", SumarySchema);
