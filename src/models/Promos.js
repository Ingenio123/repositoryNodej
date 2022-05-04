const mongodb = require("mongoose");

const NewSchemaPromo = new mongodb.Schema({
  promo_title: {
    type: String,
    required: true,
  },
  promo_description: {
    type: String,
    required: true,
  },
  promo_code: {
    type: String,
    required: true,
  },
  promo_conditons: {
    type: String,
    required: true,
  },
  promo_url_picture: {
    type: String,
    required: true,
  },
  promo_publid_id: {
    type: String,
  },
});

module.exports = mongodb.model("Promo", NewSchemaPromo);
