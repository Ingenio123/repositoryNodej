const ReviewController = require("../controllers/Revies/reviews.controller");
const router = require("express").Router();

router.post("/data/add/reviews", ReviewController.createReviews);

module.exports = router;
