const User = require("../../models/user");
const { transporter } = require("../../patterns/NodemailerAdapter");

const VerfyUserData = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ msg: "Id  not found" });
  const user = await User.findById(id);
  //   console.log(user);
  if (user.democlass.requireDemo) {
    return res.status(200).json({ status: true });
  }
  return res.status(200).json({
    status: false,
  });
};

const VerifyDemoClass = async (req, res) => {
  const idToken = req.id; // req.id -->   este es el id que da accesso el json web token ( JWT )
  if (!idToken)
    return res
      .status(400)
      .json({ success: false, message: "Token not found !" });
  // console.log("req id", idToken);
  const result = await User.findById(idToken);

  const { democlass } = result;
  return res.status(200).json({
    success: true,
    message: "Message",
    democlass: democlass.requireDemo,
  });
};

const GetDataUser = async (req, res, next) => {
  const id = req.id;
  const result = await User.findById(id).select("-password");
  const { email, FirstName, democlass, Gender, Country, numberCell } = result;
  if (democlass.requireDemo) {
    return res.status(201).json({
      status: true,
      message: "You have already taken one free class",
      data: {
        demoClass: democlass.requireDemo, // return true
        addData: 0,
      },
    });
  }
  console.log(Gender, Country, numberCell);
  if (!Gender || !Country || !numberCell) {
    return res.status(200).json({
      status: true,
      message: "all ok",
      data: {
        addData: 3,
        democlass: democlass.requireDemo, // return false
        email,
        FirstName,
      },
    });
  }
  return res.status(200).json({
    status: true,
    message: "all ok",
    data: {
      democlass: democlass.requireDemo, // return false
      addData: 1,
      email,
      FirstName,
    },
  });
};

const AddDataUserDemoclass = async (req, res, next) => {
  const { Gender, Phone, Country } = req.body;
  const id = req.id;
  if (!Gender || !Phone || !Country || !id)
    return res.status(400).json({
      error: true,
      status: false,
      message: "Data not found",
    });
  try {
    const user2 = await User.findById(id);
    if (user2.democlass.requireDemo) {
      return res.status(400).json({
        error: true,
        status: false,
        message: "You have already taken one free class",
      });
    }
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        democlass: {
          requireDemo: true,
        },
        Gender,
        numberCell: Phone,
        Country,
      },
      {
        useFindAndModify: false,
      }
    );
    if (!user)
      return res.status(500).json({
        error: true,
        status: false,
        message: "Erro to server",
      });

    await transporter.sendMail({
      from: "Luis Zapata 😎 <jlzyjose@gmail.com>",
      to: "ingenioecuador.plus@gmail.com",
      subject: "Hello ✔",
      text: "esto es una prueba desde ingenio languages",
      html: "<b>Hello world?</b>", // html body
    });

    return res.status(200).json({
      error: false,
      status: true,
      message: "We will get in touch to arrange a meeting",
    });
  } catch (_error) {
    console.error(_error);
    return res.status(500).json({
      error: true,
      message: "Erro in server",
    });
  }
};

const AddDataUserOneData = async (req, res, next) => {
  const { SecondEmail } = req.body;
  if (!SecondEmail)
    return res.status(400).json({
      status: false,
      error: true,
      message: "Not found Data",
    });
  const id = req.id;
  const user = await User.findById(id);
  console.log(user);
  if (user.democlass.requireDemo)
    return res.status(400).json({
      status: false,
      error: true,
      message: "You have already taken one free class",
    });
  const data = await User.findByIdAndUpdate(
    { _id: id },
    {
      SecondEmail,
      democlass: {
        requireDemo: true,
      },
    },
    {
      useFindAndModify: false,
    }
  );
  if (!data)
    return res.status(400).json({
      status: false,
      error: true,
      message: "User not found",
    });

  return res.status(200).json({
    error: false,
    status: true,
    message: "We will get in touch to arrange a meeting",
  });
};
module.exports = {
  VerfyUserData,
  VerifyDemoClass,
  GetDataUser,
  AddDataUserDemoclass,
  AddDataUserOneData,
};
