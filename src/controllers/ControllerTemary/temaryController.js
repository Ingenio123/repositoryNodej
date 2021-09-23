const Temary = require("../../models/TemaryModel");

const CreateOneTemary = async (req, res, next) => {
  const { name_level, sublevel } = req.body;
  console.log(req.body);

  const QueryTemary = await Temary.findOne({ name_level });

  if (QueryTemary) {
    if (QueryTemary.sublevel.length > 0) {
      const resultadoFilter = QueryTemary.sublevel.filter((val) => {
        return val.name_sublevel === sublevel[0].name_sublevel;
      });

      if (resultadoFilter.length === 0) {
        await Temary.findOneAndUpdate(
          { name_level: QueryTemary.name_level },
          { $push: { sublevel: sublevel[0] } },
          { useFindAndModify: false }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "succesffully",
    });
  }

  const newTemary = new Temary({
    name_level,
    sublevel,
  });
  console.log(newTemary);

  await newTemary.save();
  return res.status(200).json({
    success: true,
    message: "succesffully",
  });
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
