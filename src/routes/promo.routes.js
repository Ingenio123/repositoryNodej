const router = require("express").Router();
const ControllerPromo = require("../controllers/PromoController/PromoController");

router.post("/data/create/promo", ControllerPromo.createPromo);

module.exports = router;
