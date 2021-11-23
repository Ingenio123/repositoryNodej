const Student = require("../models/student");
const User = require("../models/user");
const Course = require("../models/courses");
const Role = require("../models/roles");

module.exports = {
  getAll: async (req, res, next) => {
    const students = await Student.find({}, { __v: 0 })
      .sort({ age: -1 })
      .populate({ path: "courses", populate: { path: "CourseData" } });

    return res.status(200).json({
      success: true,
      students,
    });
  },
  createOneStudent: async (req, res, next) => {
    const _id = req.id;
    const { idUser, idCurso } = req.body;
    // const user = await User.findById(_id).select("-password");
    const resultRole = await Role.findOne({ name: "student" });
    const UserQueryId = await User.findById(idUser);

    const existeRol = UserQueryId.roles.includes(resultRole._id);

    // return res.status(200).json({});
    // opcion 1.-

    if (existeRol === false) {
      const user = await User.findByIdAndUpdate(
        idUser,
        {
          $push: { roles: resultRole._id },
        },
        {
          useFindAndModify: false,
        }
      );
    }

    const { FirstName, email } = UserQueryId;
    if (!FirstName || !email)
      return res
        .status(400)
        .json({ success: false, message: "data incompleted " });

    const OneCourse = await Course.findById(idCurso).select(
      " -teachers -createdAt -updatedAt -__v"
    );

    const CourseData = OneCourse._id;
    const ExistStudent = await Student.findOneAndUpdate(
      { email },
      {
        $push: { courses: [{ CourseData }] },
      },
      {
        useFindAndModify: false,
      }
    );

    if (ExistStudent) {
      return res.status(200).json({
        success: true,
        message: "Course Add Successfully",
      });
    }

    const newStudent = new Student({
      FirstName,
      email,
      courses: [{ CourseData }],
    });

    const SaveStudent = await newStudent.save();

    const datos = await Student.findById(SaveStudent._id).populate({
      path: "courses",
      populate: { path: "CourseData" },
    });
    return res.status(200).json({
      success: true,
      message: "user Created sucessfully",
    });
  },

  /**
   * @param {req.id} req
   * @param {return state} res
   * @returns state
   **/
  DataStudent: async (req, res, next) => {
    const id = req.id; // req.id -->   este es el id que da accesso el json web token ( JWT )
    if (!id) return res.status(400).json({ message: "Err, client" });
    const Query = await User.findById(id);
    const { email } = Query;
    const QueryStudent = await Student.findOne({ email }).populate({
      path: "courses",
      populate: { path: "CourseData" },
    });

    if (!QueryStudent)
      return res.status(200).json({ success: false, Student: [] });

    return res.status(200).json({
      success: true,
      message: "todo bien amigo",
      QueryStudent,
    });
  },
};
