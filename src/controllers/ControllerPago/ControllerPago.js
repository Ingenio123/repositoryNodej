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
      expiresCours: resCache.dataCourse[i].expiresCours,
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
