const User = require("../../models/user"),
  Rol = require("../../models/roles"),
  Student = require("../../models/student"),
  CacheCompra = require("../../models/DataCache"),
  Course = require("../../models/courses");

const NewCache = async (idUser, dataCourse) => {
  const newcacheData = new CacheCompra({
    idUser,
    dataCourse, // Array []
  });
  const res = await newcacheData.save();
  if (res) return true;
  return false;
};

// Aqui   estaran todos  los controladores de pago como Busquedas  etc
const QueryRole = async (nameRole) => {
  const role = await Rol.findOne({ name: nameRole });
  return role;
};

const StudentRol = async (user) => {
  const rol = await QueryRole("student");
  const { id } = user;
  const result = await User.findByIdAndUpdate(
    id,
    {
      $push: { roles: rol },
    },
    {
      useFindAndModify: false,
    }
  );
  if (!result) return { success: false };

  return {
    success: true,
  };
};

const VerifySiExisteELStudent = async (email) => {
  const ExisteStudent = await Student.findOne({ email: email });
  if (!ExisteStudent) return { success: false };
  return { success: true, student: ExisteStudent };
};
// ##########################################################
const UpdateStudent = async (dataStudent, userData) => {
  const { _id, email } = userData;
  console.log(dataStudent, "Datos del User", userData);
  const resCache = await DatosCache(_id);

  console.log("dataos cache", resCache);
  // resCache.dataCourse;

  await Student.findOneAndUpdate(
    { email: email },
    {
      $push: {
        courses: {
          $each: resCache.dataCourse,
        },
      },
    },
    {
      useFindAndModify: false,
    }
  );

  await DeleteCache(resCache.idCache);
};

const StructItemsCompra = async (itemsArray, Email) => {
  const ArrayData = new Array();

  itemsArray.map(async (items) => {
    // console.log(items);
    ArrayData.push(items);
  });
  const DataUser = await User.findOne({ email: Email });

  const itemsCompra = new CacheCompra({
    idUser: DataUser._id,
    dataCourse: ArrayData,
  });
  const res = await itemsCompra.save();

  if (!res) {
    console.log("No hay datos en la  cache");
    return false;
  }

  return {
    success: true,
    idCompra: res._id,
  };
};

const CreateNewStudent = async (user) => {
  const { email, _id } = user;

  const resCache = await DatosCache(_id);

  console.log("dATOS DEL CACHE", resCache);

  const result1 = await StudentRol(user);
  if (result1 === false) return { success: false };

  const newStudent = new Student({
    email,
  });
  //   -------------------  Data cache course ------------------------ //
  for (var i = 0; i < resCache.dataCourse.length; i++) {
    newStudent.courses.push({
      lessonTotal: resCache.dataCourse[i].lesson.split(" ")[0],
      lesson: resCache.dataCourse[i].lesson.split(" ")[0],
      time: resCache.dataCourse[i].time,
      idiom: resCache.dataCourse[i].idiom,
      months: resCache.dataCourse[i].months,
    });
  }
  // console.log(newStudent);
  //
  //
  const resdatos = await newStudent.save();

  await DeleteCache(resCache.idCache);

  return {
    success: true,
    resdatos,
  };
};

// #####################################################################
const DatosCache = async (idUser) => {
  const DatosCache = await CacheCompra.findOne({ idUser: idUser });
  const { dataCourse, _id } = DatosCache;
  return {
    success: true,
    dataCourse,
    idCache: _id,
  };
};
// ###########################################################################

const DeleteCache = async (idCache) => {
  const res = await CacheCompra.findByIdAndDelete(idCache);
  if (!res) return { success: false };
  return { success: true };
};

//  -------------  Add course  ------------------------------------- //
/**
 *  se pasa por parametro email
 * @param {string} email
 * @returns
 */
const addCourse = async (email) => {
  const userData = await User.findOne({ email });
  const verify = await VerifySiExisteELStudent(userData.email);
  if (verify.success) {
    await UpdateStudent(verify.student, userData);
    console.log("Student Existe");
    return true;
  }
  const newStudent = await CreateNewStudent(userData);
  console.log("Nuevo Student", newStudent);

  // const fetching = async () => {
  //   const UserData = await User.findOne({ email });
  //   console.log("estamos con el estudiante", UserData);
  //   const resultRole = await Role.findOne({ name: "student" });
  //   const existeRol = UserData.roles.includes(resultRole._id);
  //   const { FirstName } = UserData;
  //   const EmailUser = UserData.email;
  //   if (existeRol === false) {
  //     await User.findByIdAndUpdate(
  //       UserData._id,
  //       {
  //         $push: { roles: resultRole._id },
  //       },
  //       {
  //         useFindAndModify: false,
  //       }
  //     );
  //   }
  //   //paramas (id -> id del user, dataCourse ->  datos de los cursos)
  //   // addDataCache()
  //   const { _id } = UserData;
  //   // var CourseQuery = await Course.findOne({ nameCourse: url });
  //   const DataUser = await Cache.findOne({
  //     idUser: _id,
  //   });
  //   const DataAsync = DataUser.dataCourse.map(async (item) => {
  //     item.items[0].map(async (iterador) => {
  //       console.log(
  //         "los datos del iterador",
  //         iterador.lesson,
  //         iterador.time,
  //         iterador.months,
  //         iterador.idiom
  //       );
  //       const lesson = iterador.lesson.split(" ")[0];
  //       const time = iterador.time.split(" ")[0];
  //       // const StudentFound = await Student.findOne({ email: item.email });
  //       // console.log(StudentFound);
  //       const UpdateStudent = SaveNewStudent(
  //         item.email,
  //         lesson,
  //         time,
  //         iterador.months,
  //         iterador.idiom
  //       );
  //       return UpdateStudent;
  //     });
  //   });
  //   await Promise.all(DataAsync);
  // };
  // fetching();
};

module.exports = {
  StructItemsCompra,
  CreateNewStudent,
  DeleteCache,
  VerifySiExisteELStudent,
  UpdateStudent,
  NewCache,
  addCourse,
};
