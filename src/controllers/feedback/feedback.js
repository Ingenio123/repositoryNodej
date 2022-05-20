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
          select: "picture FirstName _id",
        },
        {
          path: "id_Course",
          model: "Courses",
          select: "nameCourse",
        },
      ])
      .sort({ "content.date": -1 });
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

const DeleteFeedback = async (req, res, next) => {
  const { idSummary } = req.params;
  try {
    let feedbackDelete = await SummaryModel.findByIdAndDelete({
      _id: idSummary,
    }).populate([
      {
        path: "id_Teacher",
        model: "User",
        select: "picture FirstName _id",
      },
      {
        path: "id_Course",
        model: "Courses",
        select: "nameCourse",
      },
    ]);
    // console.log(feedbackDelete);
    let { id_Student, kids } = feedbackDelete;
    let { nameCourse } = feedbackDelete.id_Course;
    let data = await StudentModel.findById({ _id: id_Student });
    let { courses } = data;
    let resfilter = courses.filter(
      (e) => e.idiom == nameCourse && e.kids == e.kids
    );

    if (resfilter[0].lessonTotal < parseInt(resfilter[0].lesson)) {
      await StudentModel.findByIdAndUpdate(
        { _id: id_Student },
        {
          $set: {
            "courses.$[condition].lessonTotal": resfilter[0].lessonTotal + 1,
          },
        },
        {
          arrayFilters: [
            { "condition.kids": kids, "condition.idiom": nameCourse },
          ],
        }
      );
    }

    return res.status(200).json({
      message: "All good",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Error to server",
    });
  }
};

module.exports = {
  addFeedBack,
  getFeddBack,
  DeleteFeedback,
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
