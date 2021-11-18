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
    const courses = await Courses.find().populate(
      "teachers",
      "firstName eslogan imageUrl"
    );
    if (!courses)
      return res.status(400).json({
        success: false,
        message: "err 400",
      });

    return res.status(200).json({
      success: true,
      courses,
    });
  },
  assignTeacher: async (req, res, next) => {
    const _id = req.params.id;
    const { teachers } = req.body;
    try {
      await Courses.findByIdAndUpdate(
        _id,
        {
          $push: { teachers: teachers },
        },
        { useFindAndModify: false }
      )
        .populate("teachers")
        .exec((err, result) => {
          if (err)
            return res.status(400).json({
              success: false,
              message: "Error data client",
            });

          res.status(200).json({
            success: true,
            message: "asign Course  successffully",
            courseUpdated: result,
          });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server is on Eroor",
      });
    }
  },

  QueryCourseforIdiom: async (req, res, next) => {
    // const { id } = req.params;
    const { idiom } = req.query;
    if (!idiom)
      return res.status(400).json({ status: false, message: "Bad Request" });
    try {
      const Query = await Courses.findOne({ nameCourse: idiom }).populate(
        "teachers"
      );
      if (!Query)
        return res
          .status(400)
          .json({ success: false, message: "Error: Idiom not found" });
      const { teachers } = Query;
      /**
       * ---------------------------------
       *            DATA -->
       * ---------------------------------
       */
      if (Query) {
        const datos = teachers.map((item, index, arr) => {
          return {
            firstName: item.firstName,
            img: item.imageUrl,
            eslogan: item.eslogan,
            calendar: item.calendar,
          };
        });
        return res.status(200).json({
          success: true,
          datos,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Err on Server" });
    }
  },
};
