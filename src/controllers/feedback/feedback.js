const FeedBackModel = require("../../models/feecback");
const StudentModel = require("../../models/student");
const SummaryModel = require("../../models/Sumary/Sumary");

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

const getFeddBack = async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    const feedBack = await SummaryModel.find({
      id_Student: _id,
    })
      .populate([
        {
          path: "id_Teacher",
          model: "User",
          select: "picture FirstName -_id",
        },
        {
          path: "id_Course",
          model: "Courses",
          select: "nameCourse",
        },
      ])
      .sort({ _id: -1 });
    return res.status(200).json({
      message: "all good",
      error: false,
      success: false,
      feedBack,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addFeedBack,
  getFeddBack,
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
