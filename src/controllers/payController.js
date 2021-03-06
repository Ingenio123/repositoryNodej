const axios = require("axios");
const https = require("https");
const Student = require("../models/student");
const User = require("../models/user");
const Course = require("../models/courses");
const Role = require("../models/roles");
const Cache = require("../models/DataCache");
const {
  StructItemsCompra,
  CreateNewStudent,
  VerifySiExisteELStudent,
  UpdateStudent,
  NewCache,
} = require("./ControllerPago/ControllerPago");
const { addCourse } = require("../controllers/ControllerPago/ControllerPago");

const ClientPay = async (req, res, next) => {
  const {
    City,
    Country,
    PostCode,
    firstName,
    lastName,
    numberCedula,
    numberCellPhone,
    secondName,
    ipClient,
    Cobrar,
    SumaPrices,
    items,
    id,
    email,
    emailCustom,
  } = req.body;
  console.log(
    City,
    Country,
    PostCode,
    firstName,
    lastName,
    numberCedula,
    numberCellPhone,
    secondName,
    ipClient,
    Cobrar,
    "este es el sumprices total",
    SumaPrices,
    items,
    id,
    email,
    emailCustom
  );
  const Userdata = await User.findOne({ email: emailCustom });
  await NewCache(Userdata._id, items);
  // const datosStruct = await StructItemsCompra(items, email, Userdata._id);
  // const DatosStudent = await CreateNewStudent(Userdata);

  let cobrar = String(Cobrar);
  if (EncontrarNumero(cobrar, ".")) {
    cobrar = cobrar;
  }

  const resultados = await SendDatafast(
    City,
    Country,
    PostCode,
    firstName,
    secondName,
    lastName,
    numberCedula,
    numberCellPhone,
    ipClient,
    cobrar,
    SumaPrices,
    items,
    id,
    email,
    emailCustom
  );
  // console.log("resultados: ", resultados);
  return res.status(200).json({
    message: "todo  salio bien tranquilo hombre aatt luis",
    resultados,
  });
};

const SendDatafast = async (
  City,
  Country,
  PostCode,
  firstNameParams,
  secondName,
  lastName,
  numberCedula,
  numberCellPhone,
  ipClientParams,
  Cobrar,
  SumaPrices,
  items,
  idClient,
  email,
  emailCustom
) => {
  const number_Cedula = parseInt(numberCedula);
  const city = String(City);
  const country = String(Country);
  const CodePostal = parseInt(PostCode);
  const firstName = String(firstNameParams);
  const SecondName = String(secondName);
  const surname = String(lastName);
  const numberPhone = String(numberCellPhone);
  const ipClient = String(ipClientParams);
  const amount = Cobrar;
  const VALOR_PRODUCTO = parseInt(SumaPrices);

  const VALOR_IVA = addIva(VALOR_PRODUCTO, 12);
  console.log("valor iva: ", VALOR_IVA);

  const entityId = process.env.DATAFAST_ENTITYID;
  const MID = process.env.DATAFAST_MID;
  const TID = process.env.DATAFAST_TID;
  // #######################################
  var valores = DestructArray(items);
  const valorestotales = valores.join("&");
  console.log("valorestotales: ", valorestotales);
  // ######################################

  const data = {};
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  //URL DE PRUEBA LA QUE ESTA AQUI ABAJO
  // const url = `https://test.oppwa.com/v1/checkouts?entityId=${entityId}&amount=${VALOR_PRODUCTO}&currency=USD&paymentType=DB&customer.givenName=${firstName}&customer.middleName=${SecondName}&customer.surname=${surname}&customer.ip=${ipClient}&customer.merchantCustomerId=${idClient}&merchantTransactionId=transaction_112233&customer.email=${email}&customer.identificationDocType=IDCARD&customer.identificationDocId=${number_Cedula}&customer.phone=${numberPhone}&billing.street1=${city}&billing.country=${country}&billing.postcode=${CodePostal}&shipping.street1=${city}&shipping.country=${country}&risk.parameters%5BUSER_DATA2%5D=DATAFAST&customParameters%5BSHOPPER_MID%5D=1000000505&customParameters%5BSHOPPER_TID%5D=PD100406&customParameters%5BSHOPPER_ECI%5D=0103910&customParameters%5BSHOPPER_PSERV%5D=17913101&customParameters%5BSHOPPER_VAL_BASE0%5D=${VALOR_PRODUCTO}&customParameters%5BSHOPPER_VAL_BASEIMP%5D=0&customParameters%5BSHOPPER_VAL_IVA%5D=0&${valorestotales}&customParameters%5BSHOPPER_VERSIONDF%5D=2&testMode=EXTERNAL`;

  //URL REAL  LA QUE ESTA AQUI ABAJO
  const url = `https://oppwa.com/v1/checkouts?entityId=${entityId}&amount=${amount}&currency=USD&paymentType=DB&customer.givenName=${firstName}&customer.middleName=${SecondName}&customer.surname=${surname}&customer.ip=${ipClient}&customer.merchantCustomerId=${idClient}&merchantTransactionId=transaction_112233&customer.email=${email}&customer.identificationDocType=IDCARD&customer.identificationDocId=${number_Cedula}&customer.phone=${numberPhone}&billing.street1=${city}&billing.country=${country}&billing.postcode=${CodePostal}&shipping.street1=${city}&shipping.country=${country}&risk.parameters%5BUSER_DATA2%5D=INGENIO&customParameters%5BSHOPPER_MID%5D=${MID}&customParameters%5BSHOPPER_TID%5D=${TID}&customParameters%5BSHOPPER_ECI%5D=0103910&customParameters%5BSHOPPER_PSERV%5D=17913101&customParameters%5BSHOPPER_VAL_BASE0%5D=0&customParameters%5BSHOPPER_VAL_BASEIMP%5D=${VALOR_PRODUCTO}&customParameters%5BSHOPPER_VAL_IVA%5D=${VALOR_IVA}&${valorestotales}&customParameters%5BSHOPPER_VERSIONDF%5D=2`;

  const token = process.env.DATAFAST_TOKEN;
  try {
    let resultados = await axios.post(url, data, {
      httpsAgent: agent,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resultados.data;
  } catch (error) {
    console.log("Error", error);
  }
};

const EncontrarNumero = (numero, numEncontrar) => {
  return numero.indexOf(numEncontrar) != -1;
};

const addIva = (SumPrices, valIva) => {
  // resultado = (120 * 12) / 100
  let cobrarIva = (SumPrices * valIva) / 100;
  console.log(cobrarIva);
  return cobrarIva;
};

const DestructArray = (arrayData) => {
  let datos = [];
  arrayData.map((item, i) => {
    datos.push(
      `cart.items%5B${i}%5D.name=${item.idiom}&cart.items%5B${i}%5D.description=${item.lesson}&cart.items%5B${i}%5D.price=${item.price}&cart.items%5B${i}%5D.quantity=1`
    );
  });
  return datos;
};

const datafastResultEnd = async (req, res, next) => {
  const { id } = req.params;
  const entityId = process.env.DATAFAST_ENTITYID; //real
  console.log(entityId);
  console.log(id);
  data = {};

  // const url = `https://test.oppwa.com/v1/checkouts/${id}/payment?entityId=${entityId}`;
  const url = `https://oppwa.com/v1/checkouts/${id}/payment?entityId=${entityId}`;
  console.log("url two", url);
  const token = process.env.DATAFAST_TOKEN;
  console.log("token two", token);
  try {
    axios
      .get(url, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer  ${token}`,
        },
      })
      .then((resultado) => {
        console.log(resultado.data.customer.email);
        addCourse(resultado.data.customer.email);

        // AddStudent(resultado.data.result.code, resultado.data.customer.email);
        return res.status(200).json({
          success: true,
          message: "todo salio bien",
          resultado: resultado.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        return res.status(400).json({
          success: false,
          message: "no todo salio bien",
        });
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "ya realizo la peticion no se puede realizar 2 veces",
    });
  }
};

const AddStudent = async (codeResultado, emailCustomer) => {
  if (codeResultado === "000.100.112") {
  }
};

//
//
//

const SaveNewStudent = async (email, lesson, time, months, idiom) => {
  console.log(email, lesson, time, months);

  const course = await Course.findOne({ nameCourse: idiom });
  console.log(course);
  const newStudent = new Student({
    FirstName: "none",
    email: email,
    courses: [
      {
        lessonsTotal: parseInt(lesson),
        TimeLossons: parseInt(time),
        NumberMonths: parseInt(months),
        CourseData: course._id,
      },
    ],
  });

  const res = await newStudent.save();
  return res;
};

const SaveDataStudent = async (email, lesson, time, months, idiom) => {
  const StudentFound = await Student.findOne({ email });
  const course = await Course.findOne({ nameCourse: idiom });

  const result = await Student.findOneAndUpdate(
    { email },
    {
      $push: {
        courses: [
          {
            lessonsTotal: parseInt(lesson),
            TimeLossons: parseInt(time),
            NumberMonths: parseInt(months),
            CourseData: course._id,
          },
        ],
      },
    },
    {
      useFindAndModify: false,
    }
  );
  return result;
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const verificarSiExisteElUsuario = async (email) => {
  /* 
         ->  verificar  --> si ya es estudiante 
            ->  
    */

  const userQuery = await User.findOne({ email: email });

  if (userQuery) return true;
};

module.exports = {
  ClientPay,
  datafastResultEnd,
};

//  //ESTO SI ESTA CORRECTO
//     if (verificarSiExisteElUsuario(emailCustomer)) {
//       const resultRole = await Role.findOne({ name: "student" });
//       const UserQuery = await User.findOne({ email: emailCustomer });

//       const existeRol = UserQuery.roles.includes(resultRole._id);
//       console.log(existeRol);
//       if (existeRol === false) {
//         await User.findByIdAndUpdate(
//           UserQuery._id,
//           {
//             $push: { roles: resultRole._id },
//           },
//           {
//             useFindAndModify: false,
//           }
//         );
//       }
//       const { FirstName, email } = UserQuery;
//       if (!FirstName || !email)
//         return res
//           .status(400)
//           .json({ success: false, message: "data incompleted " });

//       const OneCourse = await Course.findById(idCurso).select(
//         " -teachers -createdAt -updatedAt -__v"
//       );
//       const CourseData = OneCourse._id;
//       const ExistStudent = await Student.findOneAndUpdate(
//         { email },
//         {
//           $push: { courses: [{ CourseData }] },
//         },
//         {
//           useFindAndModify: false,
//         }
//       );
//     }
