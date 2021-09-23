const mongoose = require("mongoose");
const conect_db = async () => {
  const MONGO_USERNAME = "admin";
  const MONGO_PASSWORD = "admin123";
  const MONGO_HOSTNAME = "167.99.145.171";
  const MONGO_PORT = "27017";
  const MONGO_DB = "IngenioApi";

  //       `mongodb://admin:admin123@167.99.145.171:27017/HomePage?authSource=admin`,
  try {
    mongoose
      .connect(
        `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,
        {
          useNewUrlParser: true,
        }
      )
      .then((db) => console.log(`conectado con exito `))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
  // mongodb://admin:admin123@167.99.145.171:27017/IngenioApi?authSource=admin
  //   try {
  //     mongoose
  //       .connect("mongodb://localhost/ingenio_app_Lenguages", {
  //         useNewUrlParser: true,
  //       })
  //       .then((db) => console.log(`conectado con exito `))
  //       .catch((err) => console.log(err));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const MONGO_USERNAME = 'admin';
  // const MONGO_PASSWORD = "admin123";
  // const MONGO_HOSTNAME = '127.0.0.1';
  // const MONGO_PORT = '27017';
  // const MONGO_DB = 'IngenioApi';

  // try {
  //      mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`,{
  //         useNewUrlParser: true
  //     })
  //         .then(db =>  console.log(`conectado con exito `))
  //         .catch(err =>  console.log('hubo un error', err))

  // }catch(err){
  //     console.log(err)
  // }
};
module.exports = {
  conect_db,
};
