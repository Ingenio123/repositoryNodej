const { Schema, model } = require("mongoose");

const MaterialTypeSchema = new Schema(
  {
    name_type: {
      type: String,
    },
  },
  { versionKey: false }
);

module.exports = model("TypeMaterial", MaterialTypeSchema);
