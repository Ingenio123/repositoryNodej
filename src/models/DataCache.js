const { Schema, model } = require("mongoose");

const NewSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dataCourse: [],
});

module.exports = model("DataCache", NewSchema);
