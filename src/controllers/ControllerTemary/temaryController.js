const Temary = require("../../models/TemaryModel");

const CreateOneTemary = async (req, res, next) => {
  const { name_level, content } = req.body;
  console.log(req.body);
  try {
    const QueryTemary = await Temary.findOne({ name_level });

    if (QueryTemary) {
      let { _id } = QueryTemary;
      await Temary.findByIdAndUpdate(_id, {
        $set: { content: content },
      });
      return res.status(200).json({
        success: true,
        message: "Se ha remplazado correctament el content.",
      });
    }

    const newTemary = new Temary({
      name_level,
      content,
    });
    await newTemary.save();

    return res.status(200).json({
      success: true,
      message: "Se ha agregado correctamente el nuevo temary",
    });
  } catch (error) {
    return res.status(500).json({ error: true });
  }
};

const AddItemstoSublevel = async (req, res, next) => {
  console.log(req.body);

  return res.status(200).json({
    success: true,
    message: "successfully",
  });
};

const GetTemary = async (req, res) => {
  const temary = await Temary.find();
  return res.status(200).json({
    success: true,
    temary,
  });
};

module.exports = {
  CreateOneTemary,
  AddItemstoSublevel,
  GetTemary,
};
