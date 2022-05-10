const router = require("express").Router();
const ControllerPromo = require("../controllers/PromoController/PromoController");

router.get("/data/get/promos", ControllerPromo.getPromos);
router.post("/data/create/promo", ControllerPromo.createPromo);

module.exports = router;
