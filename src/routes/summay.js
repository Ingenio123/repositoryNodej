const router = require("express").Router();

const { verifyIsTeacher, verifyToken } = require("../middlewares/verify");
const {
  SummaryPost,
  summaryGet,
  getScore,
  summaryStudentId,
  SummaryPostScore,
} = require("../controllers/Summary/SummaryController");
router.get("/student/summary", verifyToken, summaryGet);
router.get("/student/getprocess", verifyToken, getScore);
router.get("/sudent/summary/getsummary", verifyToken, summaryStudentId);
// POST
router.post("/teacher/summary", [verifyToken, verifyIsTeacher], SummaryPost);
router.post(
  "/teacher/summary/score",
  [verifyToken, verifyIsTeacher],
  SummaryPostScore
);

module.exports = router;
