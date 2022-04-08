const router = require("express").Router();
const Controller = require("../controllers/MaterialsController/Material.controller");
const middlewares = require("../middlewares/verify");
router.get("/data/get/materials/:idStudent", Controller.GetMaterialForStudent);

router.post(
  "/data/add/materials",
  middlewares.verifyToken,
  middlewares.verifyIsTeacher,
  Controller.AddMaterial
);

router.delete(
  "/data/delete/materials",
  middlewares.verifyToken,
  middlewares.verifyIsTeacher,
  Controller.DeleteMaterial
);

module.exports = router;
