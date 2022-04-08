const router = require("express").Router();
const userController = require("../controllers/userController");

const {
  createOne,
  updateTeachersData,
  updateImgProfile,
  getTeacherId,
  getCourses,
  getAllTeachers,
  addFlagtoTeachers,
  teacherReview,
  addCalendarTeacher,
  deleteTeacher,
  getTypeMaterials,
} = require("../controllers/teachersController");

const {
  assignTeacher,
  createOneCourse,
  deleteOneCourse,
  getAllCourses,
  updateOneCourse,
  QueryCourseforIdiom,
} = require("../controllers/coursesController");

const {
  userValidation,
  validateUserSignUp,
  validateUserSignIn,
} = require("../middlewares/validator");

const {
  verifyEmail,
  verifyAge,
  verifyToken,
  verifyIsAdmin,
  verifyIsTeacher,
  verifyIsStudent,
} = require("../middlewares/verify");

const {
  getAll,
  createOneStudent,
  DataStudent,
} = require("../controllers/studentController");

const {
  createOneFlags,
  assignTeachertoFlag,
  deleteFlag,
  getallFlags,
} = require("../controllers/flagsController");

const { GoogleAuth } = require("../controllers/googleAuth");
const {
  UserId,
  RefreshToken,
  UpdateInformationUser,
  ForgotPassword,
  UpdateNewPassword,
} = require("../controllers/userController");

const {
  ClientPay,
  datafastResultEnd,
} = require("../controllers/payController");

const {
  CreateCodeDescuento,
  CodeDescuento,
  GetAllCupons,
  DeleteCode,
} = require("../controllers/CodeDescuento/CodeDescuento");

/**
  --------------------------
             GET
  --------------------------
 */
router.get("/getCuponCode", GetAllCupons);

router.get("/", (req, res) => {
  res.render("index", {
    logged: false,
    title: "Welcome Page",
    saludo: "INGENIO",
    subtitle1: "Learn a new ",
    subtitle2: "language today",
    Unregister: true,
    // username: req.user.dispalyName
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/calendly", (req, res) => {
  res.render("calendly");
});

/* 
  ------------------------------- 
          TEACHERS
  --------------------------------
*/
router.get("/teacher", (req, res, next) => {
  res.render("teacher");
});
router.get(
  "/teacher/getmaterials",
  verifyToken,
  verifyIsTeacher,
  getTypeMaterials
);

router.get("/data/getAllTeachers", getAllTeachers); //get all teachers

router.get("/data/teacher/:id", getTeacherId); //obtener un solo docente

router.get("/data/teacher", getCourses); //obtener dato de los cursos que tiene / da  el docente

router.get("/data/teacherAccount/:_id", verifyToken, verifyIsTeacher, UserId); //teacher Account

router.get("/data/getAllCourses", getAllCourses);

router.get("/data/getAllStudents", getAll); //obtener los datos de los estudiantes

router.get("/data/getAllFlags", getallFlags); //obtener todos los datos de las banderas

router.get("/data/me", verifyToken, verifyIsAdmin, (req, res, next) => {
  return res
    .status(200)
    .json({ msg: "todo  bien ", id: `el id es ${req.userId} ` });
});
router.get("/data/user/:_id", verifyToken, UserId);

router.get("/data/getAllStudents", verifyToken, verifyIsTeacher, getAll); //get all students

// ------>  RECIVIR DATOS DE UN ACTION
router.get("/data/actions", (req, res) => {
  console.log(req.query.id);
  return res.redirect(`http://localhost:3000/results/?id=${req.query.id}`);
});

router.get("/data/datafastresults/:id", datafastResultEnd);
/**
 *
 * @params id ->  http://localhost:4000/data/courses?idiom= x
 *  */
router.get("/data/courses", QueryCourseforIdiom);

/**
 * @params id ->  del Estudiante ->   http://localhost:4000/data/verifyIstudent/
 */
router.get("/data/verifyIstudent", verifyToken, verifyIsStudent, DataStudent);
/*
  ------------------
        POST
  ------------------ 
*/
router.post(
  "/data/userSignUp",
  [validateUserSignUp, userValidation, verifyEmail, verifyAge],
  userController.registerUser
);

router.post(
  "/data/userSignIn",
  [validateUserSignIn, userValidation],
  userController.signInUser
);

//
// router.post("/data/userSignInAdmin",[],);
//
router.post("/data/refreshToken", RefreshToken);

router.post("/data/createTeacher", createOne); //crear un  usuario teacher

router.post("/data/createCourses", createOneCourse); //crear un curso

router.post("/data/createFlag", createOneFlags); //crear a Flag

router.post("/data/authGoogle", GoogleAuth); //auth whith a user google auth
// create to teacher
// router.post('/admin/createUserTeacher',verifyToken,verifyIsAdmin, userController.UserConRoles);
router.post("/admin/createUserTeacher", userController.UserConRoles);
// teacher checks the student
router.post(
  "/teacher/reviewStudent",
  verifyToken,
  verifyIsTeacher,
  teacherReview
);

router.post("/data/user/updateImage/:id", userController.UpdateImageProfile);

// create Student

// router.post('/data/createStudent',verifyToken,createOneStudent)
router.post("/data/createStudent", createOneStudent);

router.post("/payIngenioLanguages", ClientPay);

router.post("/createCodeDescuento", CreateCodeDescuento);
router.post("/verifycodeDescuento", CodeDescuento);

router.post("/data/updateinformation", verifyToken, UpdateInformationUser);

// -----------------------------------------------------------
const email = require("../controllers/ControllerEmails/index");
router.post("/sendmail", (req, res) => {
  email.sendMail();
  res.status(200).json({ msg: "ok" });
});
// -----------------------------------------------------------
/*
  -------------------------------
             PUT
  -------------------------------data/addFlagToTeachers/
 */
router.put("/data/updateTeacher/:id", updateTeachersData); // ############   UPDATE DATA TEACHER            ######
router.put("/data/updateImgProfile/:id", updateImgProfile); // ############   UPDATE PROFILE IMG     ######
router.put("/data/addTeacherCourses/:id", assignTeacher); //#############   ADD TEACHER A COURSE   ######
router.put("/data/addTeacherFlag/:id", assignTeachertoFlag); //asing teacher to Bandera
router.put("/data/addFlagToTeachers/:_id", addFlagtoTeachers);
router.put("/data/addCalendarTeacher/:_id", addCalendarTeacher); //add utl calendar
router.put("/data/updatePassword", ForgotPassword);
router.put("/data/updateNewPassword", verifyToken, UpdateNewPassword);
/*
  -------------------------------
              DELETE
  -------------------------------
 */
router.delete("/data/deletedFlag/:_id", deleteFlag);
router.delete("/data/delete/teacher/:_id", deleteTeacher);
router.delete("/data/delete/code/:_id", DeleteCode);

module.exports = router;
