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
      let idPackage =
        req.params == undefined ? req.idPackage : req.params.idPackage;
      // let idiom = req.params === undefined ? req.idiom : req.params.idiom;
      // let kids = req.params === undefined ? req.kids : req.params.kids;
      let numClassAdd =
        req.params === undefined ? req.numClassAdd : req.params.numClassAdd;
      //
      if (!email || !idPackage || !numClassAdd) return false;
      // await StudentModel.findByIdAndUpdate({_id:id},{},{arrayFilters:[{"idiom":}]})
      const studentQuery = await StudentModel.findOne({
        email: email,
        courses: {
          $elemMatch: {
            _id: idPackage,
          },
        },
      });
      if (!studentQuery) return false;

      let { lessonTotal } = studentQuery.courses.filter(
        (element) => element._id == idPackage
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
              "index0._id": idPackage,
            },
          ],
        }
      );
      return true;
    } catch (error) {
      throw error;
    }
  },
  addNewExpiredDate: async (req) => {
    let emailParams = req.params == undefined ? req.email : req.params.email;
    let dateExpires =
      req.params == undefined ? req.dateExpires : req.params.dateExpires;
    let idPackage =
      req.params == undefined ? req.idPackage : req.paramsidPackage;
    try {
      let student = await StudentModel.findOne({ email: emailParams });
      let { _id } = student;
      await StudentModel.findByIdAndUpdate(
        { _id },
        {
          $set: {
            "courses.$[index0].expiresCours": dateExpires,
            "courses.$[index0].ExpiresCourse": false,
          },
        },
        {
          new: true,
          useFindAndModify: false,
          arrayFilters: [
            {
              "index0._id": idPackage,
            },
          ],
        }
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
