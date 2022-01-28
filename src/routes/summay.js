const router = require("express").Router();

const { verifyIsTeacher, verifyToken } = require("../middlewares/verify");
const {
  SummaryPost,
  summaryGet,
  getScore,
} = require("../controllers/Summary/SummaryController");
router.get("/student/summary", verifyToken, summaryGet);
router.get("/student/getprocess", verifyToken, getScore);
// POST
router.post("/teacher/summary", [verifyToken, verifyIsTeacher], SummaryPost);

module.exports = router;
