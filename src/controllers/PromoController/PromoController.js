const PromoModel = require("../../models/Promos");
const { uploader } = require("cloudinary").v2;
const path = require("path");
const { remove } = require("fs-extra");
module.exports = {
  createPromo: async (req, res) => {
    const { promo_title, promo_description, promo_code, promo_conditons } =
      req.body;
    if (!promo_title || !promo_description || !promo_code || !promo_conditons) {
      return res.status(400).json({
        error: true,
        message: "Error  data incomplete",
      });
    }
    const { image } = req.files;

    const resultUploadImage = await uploader.upload(image.tempFilePath);
    // console.log(resultUploadImage);
    const PromoNew = new PromoModel({
      promo_title,
      promo_description,
      promo_code,
      promo_conditons,
      promo_url_picture: resultUploadImage.secure_url,
      promo_publid_id: resultUploadImage.public_id,
    });
    await PromoNew.save();
    await remove(path.resolve("./tmp"));
    return res.status(201).json({
      error: false,
      success: true,
      message: "Create success",
      promos: PromoNew,
    });
  },
  getPromos: async (req, res, next) => {
    // const {} = req.body;
    let promos = await PromoModel.find();
    return res.status(200).json({
      error: false,
      message: "all good",
      promos,
    });
  },
};
