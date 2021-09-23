const router = require("express").Router();

// create One Temary
const {
  CreateOneTemary,
  AddItemstoSublevel,
  GetTemary,
} = require("../controllers/ControllerTemary/temaryController");
router.post("/temary/createOne", CreateOneTemary);
router.post("/temary/addItemContent", AddItemstoSublevel);
router.get("/temary/getTemary", GetTemary);

module.exports = router;
