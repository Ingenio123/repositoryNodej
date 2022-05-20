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
    kids: {
      type: Boolean,
      default: false,
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
      timeLesson: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// SumarySchema.pre("update", async function (next, done) {
//   let self = this;
// });

module.exports = model("Summary", SumarySchema);
