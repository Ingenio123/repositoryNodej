const router = require("express").Router();
const {
  AddScoreExam,
  GetScore,
} = require("../controllers/ScoreExam.controller");
const { verifyToken, verifyIsTeacher } = require("../middlewares/verify");

router.post("/addScoreExam", verifyToken, verifyIsTeacher, AddScoreExam);
router.get("/getScore/:id_student", verifyToken, verifyIsTeacher, GetScore);
module.exports = router;
