const Courses = require("../models/courses");

module.exports = {
  createOneCourse: async (req, res) => {
    const { nameCourse } = req.body;
    const newCourse = new Courses({ nameCourse });
    await newCourse.save();
    return res.status(201).json({
      succes: true,
      message: "create course successfully",
    });
  },

  updateOneCourse: async (req, res) => {
    const { _id } = req.params;
    const { nameCourse } = req.body;

    await Courses.findByIdAndUpdate(
      _id,
      {
        $set: { nameCourse },
      },
      { useFindAndModify: false }
    );
    return res.status(200).json({
      success: true,
      message: "modify successffully",
    });
  },

  deleteOneCourse: async (req, res) => {
    const { _id } = req.params;
    const removed = await Courses.findByIdAndDelete(_id);

    return res.status(200).json({
      succes: true,
      message: "deleted successffully",
    });
  },
  getAllCourses: async (req, res) => {
    const courses = await Courses.find().populate("teachers");
    if (!courses)
      return res.status(400).json({
        success: false,
        message: "err 400",
      });
    return res.status(200).json({
      success: true,
      courses,
    });
    // .exec((err, result) => {
    //   return res.status(200).json({
    //     success: true,
    //     courses: result,
    //   });
    // });
  },
  assignTeacher: async (req, res, next) => {
    const _id = req.params.id;
    const { teachers } = req.body;

    const courseUpdated = await Courses.findByIdAndUpdate(
      _id,
      {
        $push: { teachers: teachers },
      },
      { useFindAndModify: false }
    )
      .populate("teachers")
      .exec((err, result) => {
        res.status(200).json({
          success: true,
          message: "asign Course  successffully",
          courseUpdated: result,
        });
      });
  },

  QueryCourseforIdiom: async (req, res, next) => {
    const { id } = req.params;
    const Query = await Courses.findById(id).populate("teachers");
    const { teachers } = Query;
    if (Query) {
      const datos = teachers.map((item, index, arr) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          img: item.imageUrl,
          eslogan: item.eslogan,
        };
      });
      return res.status(200).json({
        success: true,
        datos,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Err not found",
    });
  },
};
