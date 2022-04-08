const Role = require("../models/roles");
const TypeMaterial = require("../models/TypeMaterial");
module.exports = {
  createRoles: async () => {
    try {
      const count = await Role.estimatedDocumentCount();

      if (count > 0) return;

      const values = await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "admin" }).save(),
        new Role({ name: "student" }).save(),
        new Role({ name: "teacher" }).save(),
      ]);
    } catch (error) {
      console.log(error);
    }
  },
  createTypeMaterial: async () => {
    try {
      const count = await TypeMaterial.estimatedDocumentCount();
      if (count > 0) return;
      const values = await Promise.all([
        new TypeMaterial({ name_type: "Video" }).save(),
        new TypeMaterial({ name_type: "Document" }).save(),
        new TypeMaterial({ name_type: "Slide" }).save(),
        new TypeMaterial({ name_type: "Home Work" }).save(),
        new TypeMaterial({ name_type: "Quiz" }).save(),
      ]);
    } catch (_err) {
      throw _err;
    }
  },
};
