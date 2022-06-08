const UserModel = require("../models/user");
module.exports = {
  getUsers: async (req) => {
    return await UserModel.find({ roles: { $size: 1 } }).populate({
      path: "roles",
    });
  },
};
