const StudentModel = require("../models/student");
module.exports = {
  getAllStudents: async () => {
    return await StudentModel.find({}, { __v: 0 })
      .sort({ age: -1 })
      .populate({ path: "courses", populate: { path: "CourseData" } });
  },
  getOneStudent: async (req) => {
    let id = req.params === undefined ? req.id : req.params.id;
    return await StudentModel.findById(id);
  },
};
