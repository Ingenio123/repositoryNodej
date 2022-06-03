const StudentModel = require("../models/student");
module.exports = {
  getAllStudents: async () => {
    return await StudentModel.find({}, { __v: 0 })
      .sort({ age: -1 })
      .populate({ path: "courses", populate: { path: "CourseData" } });
  },
  getOneStudent: async (req) => {
    let email = req.params === undefined ? req.email : req.params.email;
    return await StudentModel.findOne({ email: email });
  },
  /**
   *
   * @param {*} req
   * @returns false si hubo errores | true si se modifico correctamente
   */
  addLessons: async (req) => {
    try {
      let email = req.params === undefined ? req.email : req.params.email;
      let idiom = req.params === undefined ? req.idiom : req.params.idiom;
      let kids = req.params === undefined ? req.kids : req.params.kids;
      let numClassAdd =
        req.params === undefined ? req.numClassAdd : req.params.numClassAdd;
      //
      if (!email || !idiom || !numClassAdd) return false;
      // await StudentModel.findByIdAndUpdate({_id:id},{},{arrayFilters:[{"idiom":}]})
      const studentQuery = await StudentModel.findOne({
        email: email,
        courses: {
          $elemMatch: {
            idiom: idiom,
            kids: kids,
          },
        },
      });
      if (!studentQuery) return false;

      let { lessonTotal } = studentQuery.courses.filter(
        (element) => element.idiom == idiom && element.kids == kids
      )[0];
      // console.log(datosFound);
      let calculo = lessonTotal + numClassAdd;
      // console.log(calculo);
      await StudentModel.findByIdAndUpdate(
        { _id: studentQuery._id },
        {
          $set: { "courses.$[index0].lessonTotal": calculo },
        },
        {
          new: true,
          useFindAndModify: false,
          arrayFilters: [
            {
              "index0.idiom": idiom,
              "index0.kids": kids,
            },
          ],
        }
      );
      return true;
    } catch (error) {
      throw error;
    }
  },
};
