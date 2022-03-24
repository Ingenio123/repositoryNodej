const mongoose = require("mongoose");
const conect_db = async () => {
  try {
    mongoose
      .connect(
        `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
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

// if (process.env.APP_ENV !== "production") {
//   try {
//     mongoose
//       .connect("mongodb://localhost/ingenio_app_Lenguages", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then((db) => console.log(`conectado con exito serve local `))
//       .catch((err) => console.log(err));
//   } catch (err) {
//     console.log(err);
//   }
// } else {
//   try {
//     mongoose
//       .connect(
//         `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
//         {
//           useNewUrlParser: true,
//         }
//       )
//       .then((db) => {
//         console.log(`conectado con exito to server`);
//       })
//       .catch((err) => console.log(err));
//   } catch (err) {
//     console.log(err);
//   }
// }

// try {
//   mongoose
//     .connect(
//       `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
//       {
//         useNewUrlParser: true,
//       }
//     )
//     .then((db) => {
//       console.log(`conectado con exito to server`);
//     })
//     .catch((err) => console.log(err));
// } catch (err) {
//   console.log(err);
// }
