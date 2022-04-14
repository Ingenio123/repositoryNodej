const Materials = require("../../models/Materials/Material");

const AddMaterial = async (req, res, next) => {
  //   const {} = req.body;
  console.log(JSON.stringify(req.body));

  const userexist = await Materials.findOne({
    id_student: req.body.id_student,
  });
  if (!userexist) {
    const newMAterials = new Materials(req.body);
    await newMAterials.save();
    return res.status(200).json({
      message: "very good",
    });
  }
  //
  let kids = req.body.languages[0].kids;
  let idiom = req.body.languages[0].idiom;
  let level = req.body.languages[0].material[0].level_material;
  let levelsMaterials = req.body.languages[0].material[0].levels_materials;
  let languagesArray = req.body.languages;
  let material = req.body.languages[0].material;

  const resultIdiom = await Materials.findOne({
    id_student: req.body.id_student,
    languages: {
      $all: [{ $elemMatch: { idiom: idiom, kids: kids } }],
    },
  });

  if (!resultIdiom) {
    // console.log("LANGUAGES ARRAY => ", JSON.stringify(languagesArray));
    await Materials.findByIdAndUpdate(
      { _id: userexist._id },
      {
        $push: {
          languages: languagesArray,
        },
      }
    );

    return res.status(200).json({
      message: "very good",
    });
  }

  let Level = resultIdiom.languages
    .filter((e) => e.kids === kids && e.idiom === idiom)
    .pop();
  let levelC = Level.material.filter((e) => e.level_material === level);
  let levels = levelC.length > 0 ? true : false;
  //
  if (!levels) {
    await Materials.findByIdAndUpdate(
      { _id: userexist._id },
      {
        $push: {
          "languages.$[index0].material": material,
        },
      },
      {
        new: true,
        useFindAndModify: false,
        arrayFilters: [{ "index0.idiom": idiom, "index0.kids": kids }],
      }
    );
    return res.status(200).json({
      message: "Add new level",
    });
  }

  await await Materials.findByIdAndUpdate(
    { _id: userexist._id },
    {
      $push: {
        "languages.$[index0].material.$[index1].levels_materials":
          levelsMaterials,
      },
    },
    {
      new: true,
      useFindAndModify: false,
      arrayFilters: [
        { "index0.idiom": idiom, "index0.kids": kids },
        { "index1.level_material": level },
      ],
    }
  );
  console.log("Existe el usuario" + JSON.stringify(userexist));

  return res.status(200).json({
    message: "add levels materials ",
  });
};

const DeleteMaterial = async (req, res, next) => {
  const { id_material, id_student, level_material } = req.body;
  const material = await Materials.findOne({
    id_student: id_student,
  });
  if (!material) {
    return res.status(400).json({
      error: true,
      message: "Material not existe",
    });
  }

  // await
  // id ->  del material que se va eliminar.
  // await Materials.findById();

  return res.status(200).json({
    message: "Delete success",
  });
};

const GetMaterialForIdStudent = async (req, res, next) => {
  const { idStudent } = req.params;
  let materialsData = await Materials.findOne({
    id_student: idStudent,
  }).populate("languages.material.levels_materials.type_Material");
  // .select("-__v -createdAt -updatedAt");
  // console.log(materialsData);
  return res.status(200).json({
    message: "All good",
    materials: materialsData,
  });
};

module.exports = {
  AddMaterial,
  DeleteMaterial,
  GetMaterialForIdStudent,
};
