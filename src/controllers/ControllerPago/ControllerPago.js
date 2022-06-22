const User = require("../../models/user"),
  Rol = require("../../models/roles"),
  Student = require("../../models/student"),
  CacheCompra = require("../../models/DataCache"),
  Course = require("../../models/courses"),
  axios = require("axios");

const AddDataToCalendar = async (data) => {
  console.log("ADD DATA CALENDAR => " + data);
  // const UrlCalendar = "https://www.ingeniocalendar.com/api/student/add";
  const UrlCalendar = "https://www.ingeniocalendar.com/api/student/add";
  // language, numClass, studentId, email;
  const num = parseInt(data.courses[0].lesson);
  console.log("Num de lessons: %s", num);
  const body = {
    languages: data.courses[0].idiom,
    numClass: num,
    studentId: data._id,
    email: data.email,
  };
  const response = await axios.post(UrlCalendar, body, {
    Headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Response de ingenio calendar: " + response.data);
};

async function NewCache(idUser, dataCourse) {
  const newcacheData = new CacheCompra({
    idUser,
    dataCourse, // Array []
  });
  const res = await newcacheData.save();
  if (res) return true;
  return false;
}

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

  const resCache = await DatosCache(_id);

  const Datos = {};

  for (let i = 0; i < resCache.dataCourse.length; i++) {
    Datos.lessonTotal = resCache.dataCourse[i].lesson;
    Datos.lesson = resCache.dataCourse[i].lesson;
    Datos.months = resCache.dataCourse[i].months;
    Datos.kids = resCache.dataCourse[i].kids;
    Datos.time = resCache.dataCourse[i].time;
    Datos.expiresCours = resCache.dataCourse[i].expiresCours;
    Datos.idiom = resCache.dataCourse[i].idiom;
  }
  console.log(Datos);
  const { success, data } = await VerifiyIdiom(userData, Datos); // si existe el package ->  idiom/kids devolvera true caso contrario false
  console.log(success, data);
  if (!success) {
    // success -> false
    // opcion 1
    await Student.findOneAndUpdate(
      { email: email },
      {
        $push: {
          courses: Datos,
        },
      },
      {
        useFindAndModify: false,
      }
    );
    await DeleteCache(resCache.idCache);
    return;
  }
  //
  if (Object.keys(data).length > 0) {
    const datafilter = data.courses
      .filter((e) => e.idiom === Datos.idiom && e.kids === Datos.kids)
      .pop();
    const lessonTotal = datafilter.lessonTotal;
    await UpdateCourseExistente(userData, Datos, lessonTotal);
  }
  await DeleteCache(resCache.idCache);
  return;
};
const VerifiyIdiom = async (userDataCache, Datos, data) => {
  // console.log("Datos" + JSON.stringify(Datos));
  const { email } = userDataCache;
  const studentExist = await Student.findOne({
    email: email,
    "courses.idiom": Datos.idiom,
    "courses.kids": Datos.kids,
  });

  if (!studentExist) return { data: [], success: false };
  console.log("############## EXISTE EL PACKAGE ############### ");
  return {
    data: studentExist,
    success: true,
  };
};

const UpdateCourseExistente = async (
  userDataCache,
  Datos,
  numLessonAnterior
) => {
  const { email } = userDataCache;
  // console.log("Datos" + JSON.stringify(Datos));
  // console.log("Num LessonAnterior", numLessonAnterior);
  let numTotalLesson = parseInt(Datos.lesson) + parseInt(numLessonAnterior);
  console.log("############# DATOS ##################### ", Datos);
  await Student.findOneAndUpdate(
    {
      email: email,
      "courses.idiom": Datos.idiom,
      "courses.kids": Datos.kids,
    },
    {
      $set: {
        "courses.$.lesson": Datos.lesson,
        "courses.$.months": Datos.months,
        "courses.$.time": Datos.time,
        "courses.$.expiresCours": Datos.expiresCours,
        "courses.$.lessonTotal": numTotalLesson,
      },
    },

    {
      useFindAndModify: false,
      // arrayFilters: [{ "idex0.lesson": idiom }],
    }
  );
  return {
    data: "",
    success: true,
  };
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
      kids: resCache.dataCourse[i].kids,
    });
  }
  // console.log(newStudent);
  //
  //
  const resdatos = await newStudent.save();
  // console.log("RES DATOS NEW STUDENT", resdatos);
  AddDataToCalendar(resdatos);
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
