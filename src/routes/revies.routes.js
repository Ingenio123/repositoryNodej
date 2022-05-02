const ReviewController = require("../controllers/Revies/reviews.controller");
const router = require("express").Router();

router.get("/data/get/reviews", ReviewController.getReviews);

router.post("/data/add/reviews", ReviewController.createReviews);

router.delete("/data/delete/review/:id", ReviewController.deleteReview);
module.exports = router;
