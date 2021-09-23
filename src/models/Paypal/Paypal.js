const { Schema } = require("mongoose");

const newSchema = new Schema({
  id_compra: {
    type: String,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = model("Paypal", newSchema);
