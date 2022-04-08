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
  }
  let kids = req.body.languages[0].kids;
  let idiom = req.body.languages[0].idiom;

  // if ()
  //
  console.log("Existe el usuario" + JSON.stringify(userexist));
  //
  return res.status(200).json({
    message: "very good",
  });
};

const DeleteMaterial = async (req, res, next) => {
  const { id_material, id_student, level_material } = req.body;
  const material = await Materials.findOne({
    id_student: id_student,
  });
  if (material) {
  }
  // id ->  del material que se va eliminar.
  // await Materials.findById();

  return res.status(200).json({
    message: "Delete success",
  });
};

const GetMaterialForStudent = async (req, res, next) => {
  const { idStudent } = req.params;

  const materials = await Materials.findOne({
    id_student: idStudent,
  });
  return res.status(200).json({
    success: true,
    materials,
  });
};

module.exports = {
  AddMaterial,
  DeleteMaterial,
  GetMaterialForStudent,
};
