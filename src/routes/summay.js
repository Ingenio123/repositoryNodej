const router = require("express").Router();

const { verifyIsTeacher, verifyToken } = require("../middlewares/verify");
const { SummaryPost } = require("../controllers/Summary/SummaryController");

router.post("/teacher/summary", [verifyToken, verifyIsTeacher], SummaryPost);

module.exports = router;
