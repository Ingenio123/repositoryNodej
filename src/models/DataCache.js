const { Schema, model } = require("mongoose");

const NewSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dataCourse: [
    {
      lesson: {
        type: String,
      },
      idiom: {
        type: String,
      },
      time: {
        type: String,
      },
      price: {
        type: Number,
      },
      months: {
        type: Number,
      },
      date: {
        type: Date,
        default: new Date(),
      },
      expiresCours: {
        type: Date,
      },
    },
  ],
});
NewSchema.pre("save", async function (next, docs) {
  const schema = this;
  for (let i = 0; i < schema.dataCourse.length; i++) {
    if (!schema.dataCourse[i].expiresCours) {
      const date = new Date();
      schema.dataCourse[i].expiresCours = new Date(
        date.setMonth(date.getMonth() + schema.dataCourse[i].months)
      );
      return next();
    }
  }
});

module.exports = model("DataCache", NewSchema);
