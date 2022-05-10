const router = require("express").Router();
const ControllerPromo = require("../controllers/PromoController/PromoController");

router.get("/data/get/promos", ControllerPromo.getPromos);
router.post("/data/create/promo", ControllerPromo.createPromo);
router.delete("/data/delete/promo/:id", ControllerPromo.deletePromo);
router.put("/data/update/promo/active/:id/", ControllerPromo.activePromo);
module.exports = router;
