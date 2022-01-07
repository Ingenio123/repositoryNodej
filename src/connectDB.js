const mongoose = require("mongoose");
const conect_db = async () => {
  try {
    mongoose
      .connect(
        `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
        {
          useNewUrlParser: true,
        }
      )
      .then((db) => {
        console.log(`conectado con exito to server`);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  conect_db,
};
