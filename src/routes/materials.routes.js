const router = require("express").Router();
const Controller = require("../controllers/MaterialsController/Material.controller");
const middlewares = require("../middlewares/verify");
router.get(
  "/data/get/materials/:idStudent",
  middlewares.verifyToken,
  middlewares.verifyIsTeacher,
  Controller.GetMaterialForIdStudent
);
//
router.get(
  "/data/get/materials/student/:id_student/:id_language",
  middlewares.verifyToken,
  middlewares.verifyIsStudent,
  Controller.GetMaterialTokenStudent
);

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
