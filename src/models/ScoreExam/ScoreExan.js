const { Schema, model } = require("mongoose");

const ScoreExam = new Schema(
  {
    id_student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    Content: [
      {
        idiom: {
          type: String,
          require: true,
        },
        kids: {
          type: Boolean,
          default: false,
        },

        level: [
          {
            name_level: {
              type: String,
              unique: false,
            },
            Date: {
              type: Date,
              default: Date.now(),
            },
            id_teacher: {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
            score: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("ScoreExam", ScoreExam);
