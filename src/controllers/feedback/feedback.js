const FeedBackModel = require("../../models/feecback");
const StudentModel = require("../../models/student");

const addFeedBack = async (req, res) => {
  const {
    studentID,
    teacherID,
    idiom,
    classSummary,
    comments,
    level_ID,
    sublevel_ID,
    conten_ID,
  } = req.body;

  if (
    !studentID ||
    !teacherID ||
    !classSummary ||
    !comments ||
    !level_ID ||
    !sublevel_ID ||
    !conten_ID
  ) {
    return res.status(400).json({
      error: true,
      message: "Error Data incomplete",
    });
  }

  const newFeedBack = new FeedBackModel({
    studentID,
    teacherID,
    classSummary,
    comments,
    idiom,
    levels: [
      {
        level_ID,
        sublevel_ID,
        conten_ID,
      },
    ],
  });

  const feedback = await newFeedBack.save();
  DeleteOneClass(studentID);
  return res.status(200).json({
    error: false,
    feedback,
  });
};

module.exports = {
  addFeedBack,
};

async function DeleteOneClass(id_student) {
  const studentData = await StudentModel.findById(id_student);
  console.log(studentData);
  //  await model.updateOne(
  //    { _id: { $eq: id } },
  //    { $set: { "storage.$[stor]": storageDataUpdateStorage } },
  //    { arrayFilters: [{ "stor._id": { $eq: idStorage } }] }
  //  );
  // const student = await StudentModel.findByIdAndUpdate(id_student, {

  // });

  return "";
}
