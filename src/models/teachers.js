const { Schema, model } = require("mongoose");

const teachersSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: "",
  },
  eslogan: {
    type: String,
  },
  description: {
    type: String,
  },
  graduated: {
    type: String,
  },
  age: {
    type: Number,
  },
  public_id: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  profesionalBackround: {
    type: String,
  },
  Interests: {
    type: String,
  },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  flags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Flag",
    },
  ],
  calendar: [
    {
      time: {
        type: Number,
      },
      urlCalendar: {
        type: String,
      },
    },
  ],
});
teachersSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("Teachers", teachersSchema);
