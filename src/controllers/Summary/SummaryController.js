const SummaryClass = require("../../models/Sumary/Sumary");
const Student = require("../../models/student");
const Course = require("../../models/courses");
const User = require("../../models/user");

module.exports = {
  getScore: async (req, res, next) => {
    const _id = req.id;
    const query = req.query;
    console.log(query);

    return res.status(200).json({
      status: true,
      message: "all good ",
    });
  },
  summaryStudentId: async (req, res) => {
    const _id = req.id;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "User Not Found or  Incomplet params",
      });
    }

    try {
      const user = await User.findById(_id);
      const student = await Student.findOne({ email: user.email });

      const dataStudent = await SummaryClass.find(
        { id_Student: student._id },
        "content kids -_id"
      )
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
        .sort({ "content.date": -1 });
      const datosfinally = dataStudent.map((item) => {
        return {
          kids: item.kids,
          content: {
            classSummary: item.content.classSummary,
            comments: item.content.comments,
            date: item.content.date,
          },
          course: item.id_Course.nameCourse,
          teacher: {
            name: item.id_Teacher.FirstName,
            email: item.id_Teacher.email,
            picture: item.id_Teacher.picture,
          },
        };
      });
      return res.status(200).json({
        success: true,
        data: datosfinally,
      });
    } catch (_error) {
      console.log(_error);
      return res.status(500).json({});
    }
  },
  summaryGet: async (req, res, next) => {
    const _id = req.id;
    console.log(_id);
    const { language } = req.query;
    if (!language)
      return res.status(400).json({
        error: true,
        message: "Url query is empty",
      });
    const user = await User.findById(_id);

    const studentQuery = await Student.findOne({ email: user.email });
    const summary = await SummaryClass.find({
      id_Student: studentQuery._id,
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
    console.log(summary);

    const datos = summary.filter((item) => {
      return item.id_Course.nameCourse === language;
    });
    console.log(datos);

    const datosMap = datos.map((item) => {
      return {
        score: item.score,
        kids: item.kids,
        content: {
          classSummary: item.content.classSummary,
          comments: item.content.comments,
          date: item.content.date,
        },
        course: item.id_Course.nameCourse,
        teacher: {
          name: item.id_Teacher.FirstName,
          email: item.id_Teacher.email,
          picture: item.id_Teacher.picture,
        },
      };
    });

    return res.status(200).json({
      message: "todo bien",
      data: datosMap,
    });
  },
  // ###################################################### //
  SummaryPost: async (req, res) => {
    try {
      console.log("LESSONS_SUMMARY ");
      const idTeacher = req.id;

      const { SummaryInput, Comments, idiom, email, date, kids, time } =
        req.body;
      console.log("REQ BODY", req.body);

      if (!SummaryInput || !Comments || !idiom || !email || !date || !time) {
        return res.status(400).json({
          error: true,
          message: "Data incomplete.",
        });
      }
      console.log(time);
      const StudentQuery = Student.findOne({ email: email });
      const IdiomQuery = Course.findOne({ nameCourse: idiom });

      // console.log("id user req.id: \t" + req.id);
      // run two asynchronous processes
      const resp = await Promise.all([StudentQuery, IdiomQuery]);
      console.log("############ PROMISE ALL ##############", resp);
      const [student, course] = resp;
      console.log(
        "#### STUDENT ########",
        student,
        "########## COURSE ############",
        course
      );
      // console.log(student.courses); // student tenemos el object del student
      // console.log("Id student: " + student._id);
      // console.log("Id course: " + course._id);
      // console.log("Id teacher: " + idTeacher);
      //
      const datosS = student.courses.find(
        (elem) => elem.idiom === idiom && elem.kids === kids
      );

      console.log("Datos Student son %s values: ", datosS);
      //
      if (datosS.lessonTotal === 0) {
        return res.status(400).json({
          error: true,
          expireLesson: true,
        });
      }
      console.log("######### LESSON TOTAL ###########", datosS.lessonTotal);
      let total = datosS.lessonTotal - 1;
      const studenstQuery = await Student.findOneAndUpdate(
        {
          email: email,
          courses: {
            $elemMatch: {
              idiom: idiom,
              kids: datosS.kids,
            },
          },
        },
        {
          $set: { "courses.$.lessonTotal": total },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

      console.log(
        "########### SE REALIZO LA MODIFICAION #########",
        studenstQuery
      );

      // ###########################################
      // console.log("Estos son los resultados: " + resp);
      // const datos = resp.map((item, index) => {
      //   return {
      //     id: item._id,
      //     index: index,
      //   };
      // });
      // console.log("Datos son : " + datos);

      const NewSummary = new SummaryClass({
        id_Student: student._id,
        id_Course: course._id,
        id_Teacher: idTeacher,
        kids: kids,
        content: {
          classSummary: SummaryInput,
          comments: Comments,
          date: date,
          timeLesson: time,
        },
      });

      await NewSummary.save();

      // console.log(SummaryResult);
      return res.status(200).json({
        message: "Ok",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Error to Server",
      });
    }
  },

  // ####################################################################
  SummaryPostScore: async (req, res) => {
    const id = req.id;
    const { email, kids, idiom, minus } = req.body;
    // console.log(email, kids, idiom);
    if (!email || !idiom)
      return res.status(400).json({
        error: true,
        message: "Data incomplete",
      });
    const StudentQuery = Student.findOne({ email: email });
    const IdiomQuery = Course.findOne({ nameCourse: idiom });
    const resp = await Promise.all([StudentQuery, IdiomQuery]);
    //

    // console.log(resp[0].courses);
    const datoEncontrado = resp[0].courses.filter(
      (elem) => elem.idiom === idiom && elem.kids === kids
    );
    let { score } = datoEncontrado[0];
    let bandera = 0;
    if (!minus) {
      // => false | null
      bandera = 1;
      score = score + 5.55;
    }
    if (bandera != 1) {
      console.log("MINUS");
      score = score - 5.55;
    }

    try {
      await Student.findOneAndUpdate(
        {
          email: email,
          "courses.idiom": idiom,
          "courses.kids": kids,
        },
        {
          $set: {
            "courses.$.score": score.toFixed(2),
          },
        },
        {
          useFindAndModify: false,
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({});
    }
    if (bandera != 1) {
      return res.status(200).json({
        message: "all good",
        minus: true,
      });
    }
    return res.status(200).json({
      message: "all good",
      minus: false,
    });
  },
};
