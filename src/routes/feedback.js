const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/verify");
const controller = require("../controllers/feedback/feedback");

router.post(
  "/add",
  middleware.verifyToken,
  middleware.verifyIsTeacher,
  controller.addFeedBack
);

module.exports = router;
