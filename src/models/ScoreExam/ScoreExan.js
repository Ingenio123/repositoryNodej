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
              require: true,
            },
            subLevel: [
              {
                name_sublevel: {
                  type: String,
                  required: true,
                },
                score: {
                  type: Number,
                  default: 0,
                },
                id_teacher: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                },
              },
            ],
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
