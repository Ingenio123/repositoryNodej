const Materials = require("../../models/Materials/Material");
const Student = require("../../models/student");

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

  await Materials.findByIdAndUpdate(
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
  const { id_material, id_student, level_material, kids, idiom } = req.body;
  if (!id_material || !id_student || !level_material || !idiom) {
    return res.status(400).json({
      error: true,
      message: "Data incomplete",
    });
  }
  //
  try {
    const material = await Materials.findOne({
      id_student: id_student,
    });
    //
    if (!material) {
      return res.status(400).json({
        error: true,
        message: "Material not exist",
      });
    }
    //
    let datosSearch = material.languages
      .filter((e) => e.kids == kids && e.idiom == idiom)
      .pop();
    //
    console.log(datosSearch);
    //
    if (datosSearch.length <= 0) {
      return res.status(400).json({
        error: true,
        message: "Languages not exist",
      });
    }
    //
    await Materials.findOneAndUpdate(
      {
        id_student: id_student,
      },
      {
        $pull: {
          "languages.$[index0].material.$[index1].levels_materials": {
            _id: id_material,
          },
        },
      },
      {
        new: true,
        useFindAndModify: false,
        arrayFilters: [
          { "index0.idiom": idiom, "index0.kids": kids },
          { "index1.level_material": level_material },
        ],
      }
    );

    return res.status(200).json({
      message: "Delete success",
      id_material: id_material,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Error validate data",
    });
  }
};

const GetMaterialForIdStudent = async (req, res, next) => {
  const { idStudent } = req.params;
  let materialsData = await Materials.findOne({
    id_student: idStudent,
  }).populate("languages.material.levels_materials.type_Material");
  // .select("-__v -createdAt -updatedAt");
  console.log(materialsData);
  return res.status(200).json({
    message: "All good",
    materials: materialsData,
  });
};

const GetMaterialTokenStudent = async (req, res, next) => {
  // const idStudent = req.id;
  let { id_language, id_student } = req.params; // language => id del language que tiene comprado

  // console.log(id_student, id_language);
  let datos = Materials.findOne({
    id_student: id_student,
  }).populate("languages.material.levels_materials.type_Material");
  // .populate(); //type_Material
  let dataStudent = Student.findById({ _id: id_student });

  let datosFinally = await Promise.all([datos, dataStudent]);
  //
  //
  let datosCourses = datosFinally[1].courses.map((e) => {
    return {
      kids: e.kids,
      idiom: e.idiom,
      _id: e._id,
    };
  });

  //

  let right = [];
  datosFinally[0].languages.filter((d) => {
    datosCourses.filter((s) => {
      if (d.kids === s.kids && d.idiom === s.idiom) {
        d._id = s._id;
        return right.push(d);
      }
    });
  });

  return res.status(200).json({
    messsage: "all good",
    error: false,
    data: right,
  });
};

module.exports = {
  AddMaterial,
  DeleteMaterial,
  GetMaterialForIdStudent,
  GetMaterialTokenStudent,
};
