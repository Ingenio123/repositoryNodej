const { Schema, model } = require("mongoose");
const { stringify } = require("qs");

// const studentSchema = new Schema(
//   {
//     FirstName: {
//       type: String,
//     },
//     age: {
//       type: Number,
//     },
//     updatedBy: {
//       type: Schema.Types.ObjectId,
//     },
//     email: {
//       type: String,
//     },
//     NumberCellPhone: {
//       type: Number,
//     },
//     courses: [],
//   },
//   { timestamps: true }
// );
const studentSchema = new Schema(
  {
    FirstName: {
      type: String,
    },
    age: {
      type: Number,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
    },
    email: {
      type: String,
    },
    NumberCellPhone: {
      type: Number,
    },
    courses: [
      {
        DatepayCourse: {
          type: String,
          default: () => {
            dateByLuis = new Date();
            let date = ("0" + dateByLuis.getDate()).slice(-2);

            // current month
            let month = ("0" + (dateByLuis.getMonth() + 1)).slice(-2);

            // current year
            let year = dateByLuis.getFullYear();

            // current hours
            let hours = dateByLuis.getHours();

            // current minutes
            let minutes = dateByLuis.getMinutes();

            // current seconds
            let seconds = dateByLuis.getSeconds();
            return `${month}/${date}/${year} hours ${hours}:${minutes} `;
          },
        },
        ExpiresCourse: {
          type: Boolean,
          default: false,
        },
        lessonTotal: {
          type: Number,
          default: 0,
        },
        lesson: {
          type: String,
          default: 0,
        },
        months: {
          type: String,
          default: 1,
        },
        time: {
          type: String,
        },
        idiom: {
          type: String,
        },
        expiresCours: {
          type: Date,
        },
        score: {
          type: Number,
          default: 0,
        },
        kids: {
          type: Boolean,
          default: false,
        },
        CourseData: {
          type: Schema.Types.ObjectId,
          ref: "Courses",
        },
      },
    ],
  },
  { timestamps: true }
);
studentSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("Student", studentSchema);
