const UserModel = require("../models/user");
module.exports = {
  getUsers: async (req) => {
    return await UserModel.find().populate({ path: "roles" });
  },
};
