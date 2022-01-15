const SummaryClass = require("../../models/Sumary/Sumary");
const Student = require("../../models/student");
const Course = require("../../models/courses");
const User = require("../../models/user");

module.exports = {
  summaryGet: async (req, res, next) => {
    const id = req.id;
    const { language } = req.query;
    if (!language)
      return res.status(400).json({
        error: true,
        message: "Url query is empty",
      });
    const user = await User.findById(id);
    const studentQuery = await Student.findOne({ email: user.email });
    const summary = await SummaryClass.find({
      id_Student: studentQuery._id,
    }).populate("id_Course id_Teacher ");
    // console.log(summary);

    const datos = summary.filter((item) => {
      return item.id_Course.nameCourse === language;
    });

    const datosMap = datos.map((item) => {
      return {
        content: {
          classSummary: item.content.classSummary,
          comments: item.content.comments,
          date: item.content.date,
        },
        course: item.id_Course.nameCourse,
        teacher: {
          email: item.id_Teacher.email,
          picture: item.id_Teacher.picture,
        },
      };
    });

    return res.status(200).json({
      message: "todo bien",
      data: datosMap,
    });
    // const datos = summary.map((item, index) => {
    //   if (idioma === item.id_Course.nameCourse) {
    //     return {
    //       content: {
    //         classSummary: item.content.classSummary,
    //         comments: item.content.comments,
    //         date: item.content.date,
    //       },
    //       course: item.id_Course.nameCourse,
    //       teacher: {
    //         email: item.id_Teacher.email,
    //         picture: item.id_Teacher.picture,
    //       },
    //     };
    //   }
    // });
    // console.log(datos);
    // const { nameCourse } = summary.id_Course;
    // const { picture } = summary.id_Teacher; // picture ,FirstName
    // const { content } = summary;

    // const {} = summary;
    // const { picture } = summary.id_Teacher;
  },
  SummaryPost: async (req, res) => {
    try {
      const idTeacher = req.id;
      const { SummaryInput, Comments, Name, idiom, email, date } = req.body;
      if (!SummaryInput || !Comments || !Name || !idiom || !email || !date) {
        return res.status(400).json({
          error: true,
          message: "Data incomplete.",
        });
      }
      const StudentQuery = Student.findOne({ email: email });
      const IdiomQuery = Course.findOne({ nameCourse: idiom });

      // console.log("id user req.id: \t" + req.id);
      // run two asynchronous processes
      const resp = await Promise.all([StudentQuery, IdiomQuery]);

      const datos = resp.map((item, index) => {
        return {
          id: item._id,
          index: index,
        };
      });

      // console.log("id student " + datos[0].id + "\n");
      // console.log("id course " + datos[0].id);
      // console.log(req.body);
      const NewSummary = new SummaryClass({
        id_Student: datos[0].id,
        id_Course: datos[1].id,
        id_Teacher: idTeacher,
        content: {
          classSummary: SummaryInput,
          comments: Comments,
          date: date,
        },
      });

      const SummaryResult = await NewSummary.save();

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
};
