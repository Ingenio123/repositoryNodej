const Teachers = require("../models/teachers");
const Courses = require("../models/courses");

const path = require("path");
const { remove } = require("fs-extra");
const { uploader } = require("cloudinary").v2;

module.exports = {
  getAllTeachers: async (req, res) => {
    const teachers = await Teachers.find().populate("flags");
    return res.status(200).json({
      success: true,
      teachers,
    });
  },
  createOne: async (req, res, next) => {
    const {
      firstName,
      lastName,
      description,
      graduated,
      age,
      eslogan,
      profesionalBackround,
    } = req.body;

    const { imageTeacher } = req.files;

    if (!imageTeacher)
      return res.status(401).json({
        success: false,
        message: "img not found ",
      });

    const result = await uploader.upload(imageTeacher.tempFilePath);

    // result.secure_url
    const newTeachers = new Teachers({
      firstName,
      lastName,
      description,
      graduated,
      eslogan,
      age,
      profesionalBackround,
      public_id: result.public_id,
      imageUrl: result.secure_url,
    });
    await newTeachers.save();
    await remove(path.resolve("./tmp"));

    return res.status(201).json({
      success: true,
      message: "Teachers created successfully!",
    });
  },
  updateTeachersData: async (req, res, next) => {
    const _id = req.params.id;
    console.log(_id);
    console.log(req.body);
    const {
      name,
      lastName,
      description,
      graduated,
      age,
      eslogan,
      profBackground,
      interests,
    } = req.body;

    await Teachers.findByIdAndUpdate(
      _id,
      {
        $set: {
          firstName: name,
          lastName,
          description,
          graduated,
          age,
          eslogan,
          profesionalBackround: profBackground,
          Interests: interests,
        },
      },
      {
        useFindAndModify: false,
      }
    );
    await remove(path.resolve("./tmp"));

    return res.status(200).json({
      success: true,
      message: "modify successfully",
    });
  },
  updateImgProfile: async (req, res, next) => {
    const _id = req.params.id;
    const { imageTeacher } = req.files;

    if (!imageTeacher)
      return res.stus(401).json({ succes: false, message: "img not foud :( " });

    const publicId = await Teachers.findById(_id);

    // eliminar una img de cloudinary
    await uploader.destroy(publicId.public_id);

    const result = await uploader.upload(imageTeacher.tempFilePath);

    await Teachers.findByIdAndUpdate(
      _id,
      {
        $set: {
          public_id: result.public_id,
          imageUrl: result.secure_url,
        },
      },
      {
        useFindAndModify: false,
      }
    );

    await remove(path.resolve("./tmp"));

    return res.status(200).json({
      succes: true,
      message: " image modify successfully",
    });
  },
  getTeacherId: async (req, res, next) => {
    const { id } = req.params;
    const teacherId = await Teachers.findById(id).populate("flags");

    return res.status(200).json({
      success: true,
      teacher: teacherId,
    });
  },
  getCourses: async (req, res, next) => {
    const { name } = req.query;

    const course = await Courses.find({
      teachers: { $not: { $size: 0 } },
    }).populate({ path: "teachers", match: { firstName: name } });
    const teacherCourse = course.filter(
      (courses) => courses.teachers.length > 0
    );
    return res.status(200).json({
      success: true,
      message: "course succeffully",
      courses: teacherCourse,
    });
  },
  addFlagtoTeachers: async (req, res, next) => {
    const { _id } = req.params;
    const { FlagId } = req.body;

    await Teachers.findByIdAndUpdate(
      _id,
      {
        $push: { flags: FlagId },
      },
      {
        useFindAndModify: false,
      }
    )
      .populate("flags")
      .exec((err, result) => {
        res.status(200).json({
          success: true,
          message: "asign Flag  successffully",
          courseUpdated: result,
        });
      });
  },
  addCalendarTeacher: async (req, res) => {
    const { _id } = req.params;
    const { time, url_calendar } = req.body;
    if (!time || !url_calendar)
      return res.status(400).json({
        error: true,
        message: "Data incomplete",
      });
    // ----------->  Query and Update <-------------- //
    const teacher = await Teachers.findByIdAndUpdate(
      _id,
      {
        $push: {
          calendar: {
            time: time,
            urlCalendar: url_calendar,
          },
        },
      },
      {
        useFindAndModify: false,
      }
    );
    if (!teacher)
      return res.status(400).json({
        error: true,
        message: "Id teacher not exist",
      });
    return res.status(200).json({
      error: false,
      message: "Ok",
    });
  },
  teacherReview: (req, res, next) => {
    return res.status(200).json({
      success: true,
      message: "successfully reviewed from the teacher",
    });
  },
  deleteTeacher: async (req, res, next) => {
    try {
      const { _id } = req.params;
      console.log(_id);
      const teacher = await Teachers.findByIdAndDelete(_id);
      if (!teacher) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Teacher not found",
        });
      }
      return res.status(200).json({
        success: true,
        error: false,
        message: "Delete Success fully",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Error",
      });
    }
  },
};
