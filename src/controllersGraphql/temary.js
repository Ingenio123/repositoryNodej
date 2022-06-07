const TemaryModel = require("../models/TemaryModel");
module.exports = {
  createOneTemary: async (req) => {
    let name_level =
      req.params == undefined ? req.nameLevel : req.params.nameLevel;
    let content_param =
      req.params == undefined ? req.content_param : req.params.content_param;
    let temary = await TemaryModel.findOne({ name_level });
    if (temary) {
      let { _id } = temary;
      await TemaryModel.findByIdAndUpdate(_id, {
        $set: {
          content: content_param,
        },
      });
      return true;
    }
    let Temary = new TemaryModel({
      name_level,
      content: content_param,
    });
    await Temary.save();
    return true;
  },
};
