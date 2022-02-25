const router = require("express").Router();
const {
  AddScoreExam,
  GetScore,
  UpdateScore,
} = require("../controllers/ScoreExam.controller");
const { verifyToken, verifyIsTeacher } = require("../middlewares/verify");

router.post("/addScoreExam", verifyToken, verifyIsTeacher, AddScoreExam);
router.get("/getScore/:id_student", verifyToken, verifyIsTeacher, GetScore);
router.put("/updateScoreExam", verifyToken, verifyIsTeacher, UpdateScore);

module.exports = router;
