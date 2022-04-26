const mongoose = require("mongoose");

const SchemaReviews = new mongoose.Schema({
  url_image: {
    type: String,
  },
  public_id: {
    type: String,
  },
  countryIso: {
    type: String,
  },
  name_user: {
    type: String,
  },
  languages_is_learning: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Reviews", SchemaReviews);
