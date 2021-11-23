const { Schema, model } = require("mongoose");

const CodeModel = new Schema(
  {
    Codeval: {
      type: String,
      unique: true,
    },
    Valor: {
      type: String,
    },
    numberUses: {
      type: Number,
      required: true,
    },
    caducado: {
      type: Boolean,
      default: false,
    },
    expiresCode: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Code_Desc", CodeModel);
