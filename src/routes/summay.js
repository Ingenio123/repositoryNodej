const router = require("express").Router();

const { verifyIsTeacher, verifyToken } = require("../middlewares/verify");
const {
  SummaryPost,
  summaryGet,
} = require("../controllers/Summary/SummaryController");
router.get("/student/summary", verifyToken, summaryGet);
router.post("/teacher/summary", [verifyToken, verifyIsTeacher], SummaryPost);

module.exports = router;
