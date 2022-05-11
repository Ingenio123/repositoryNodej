const PromoModel = require("../../models/Promos");
const { uploader } = require("cloudinary").v2;
const path = require("path");
const { remove } = require("fs-extra");
const ObjectId = require("mongoose").Types.ObjectId;

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
  deletePromo: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id && !ObjectId.isValid(id))
        return res
          .status(400)
          .json({ error: true, message: "Params id not found" });

      let success = await PromoModel.findByIdAndDelete({ _id: id });
      await uploader.destroy(success.promo_publid_id);
      if (!success)
        return res.status(400).json({
          error: true,
          message: "Promo not found,maybe the id params is not correct",
        });
      return res.status(200).json({
        error: false,
        message: "promo removed successfully",
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "something fail in server",
      });
      throw err;
    }
  },
  activePromo: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { template } = req.query;
      // console.log(id);
      // console.log(template);
      let activePromo = await PromoModel.find({ promo_active: true });
      // console.log(activePromo);
      //
      if (activePromo.length === 0) {
        await PromoModel.findByIdAndUpdate(
          { _id: id },
          { $set: { promo_active: true, promo_type_template: template } }
        );
        return res.status(200).json({
          error: false,
          message: "Promo add success",
        });
      }
      //
      let { _id } = activePromo[0];
      let promo_template = activePromo[0].promo_type_template;
      console.log(id + " --- " + _id);
      //
      //
      if (_id != id) {
        // console.log("Son diferentes ids");
        //
        let Quit = PromoModel.findByIdAndUpdate(
          { _id: _id },
          {
            $set: { promo_active: false, promo_type_template: template },
          }
        );
        let add = await PromoModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              promo_type_template: template,
              promo_active: true,
            },
          }
        );
        let result = await Promise.all([Quit, add]);
        console.log(result);
        return res.status(200).json({
          error: false,
          message: "activate new promo ",
        });
      }
      //
      if (promo_template !== parseInt(template)) {
        await PromoModel.findByIdAndUpdate(
          { _id: _id },
          {
            $set: { promo_type_template: template },
          }
        );
        return res.status(200).json({
          error: false,
          message: "modify template successful",
        });
      }

      //
      return res.status(200).json({
        error: false,
        message: "all good",
      });
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "something fail in server",
      });
      throw err;
    }
  },
  getPromoActive: async (req, res, next) => {
    try {
      let promo = await PromoModel.findOne({ promo_active: true });
      console.log(promo);
      return res.status(200).json({
        error: false,
        promo,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
      });
    }
  },
};
