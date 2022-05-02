const { uploader } = require("cloudinary").v2;
const Review = require("../../models/Reviews/revies.model");
const { remove } = require("fs-extra");
const path = require("path");
module.exports = {
  createReviews: async (req, res, next) => {
    const { countryIso, name_user, languages_is_learning, description } =
      req.body;
    const { imageUser } = req.files;
    if (!imageUser)
      return res.status(400).json({
        message: "Error not image",
      });

    const result = await uploader.upload(imageUser.tempFilePath);

    const ReviewObject = new Review({
      countryIso,
      name_user,
      languages_is_learning,
      description,
      url_image: result.secure_url,
    });
    await ReviewObject.save();
    await remove(path.resolve("./tmp"));

    return res.status(201).json({
      success: true,
      message: "Create Successfully",
    });
  },
  getReviews: async (req, res, next) => {
    let datosReviews = await Review.find();
    return res.status(200).json({
      reviews: datosReviews,
      message: "all good",
    });
  },
  deleteReview: async (req, res, next) => {
    const { id } = req.params;
    // console.log("ID" + id);
    let deleteReview = await Review.findByIdAndDelete({ _id: id });
    if (deleteReview) {
      return res.status(200).json({
        message: "all good",
        error: false,
      });
    }
  },
};
