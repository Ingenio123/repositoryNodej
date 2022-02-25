const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Role = require("../models/roles");
const { uploader } = require("cloudinary").v2;
const { remove } = require("fs-extra");
const validator = require("email-validator");
const crypto = require("crypto");
const { transporter } = require("../patterns/NodemailerAdapter");

// const SingletonDelete = require("../patterns/DeleteSingleton");
const path = require("path");

const UpdateInformationUser = async (req, res, next) => {
  console.info(req.body);
  console.info(req.id);
  // Age: '20',
  // firstName: 'first',
  // lastName: 'last ',
  // country: 'ec',
  // phone: '593939098050',
  // gender: 'Male',
  // countryeNationality: 'EC
  const _id = req.id;
  var {
    Age,
    firstName,
    lastName,
    country,
    phone,
    gender,
    countryeNationality,
  } = req.body;
  try {
    const UserData = await User.findById(_id);
    // console.log(UserData);

    const { FirstName, Country, Gender, numberCell } = UserData;

    if (!firstName) {
      firstName = FirstName;
    }
    if (!Country) {
      country = Country;
    }
    if (!gender) {
      gender = Gender;
    }
    if (!phone) {
      phone = numberCell;
    }
    await User.findByIdAndUpdate(
      { _id: _id },
      {
        $set: {
          FirstName: firstName,
          LastName: lastName,
          Country: country,
          Gender: gender,
          numberCell: phone,
          age: Age,
          CountryNationality: countryeNationality,
        },
      }
    );
    return res.status(200).json({
      message: "All good",
    });
  } catch (error) {
    throw error;
  }
};

const registerUser = async (req, res) => {
  const {
    FirstName,
    LastName,
    email,
    password,
    confirmPassword,
    age,
    Gender,
    country,
    phone,
  } = req.body;

  if (
    !FirstName ||
    !LastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !age ||
    !phone ||
    !Gender ||
    !country
  ) {
    return res.status(401).json({
      message: "datos incompletos",
    });
  }

  const newUser = new User({
    FirstName,
    LastName,
    email,
    password,
    age,
    Gender,
    Country: country,
    numberCell: phone,
  });

  const role = await Role.findOne({ name: "user" });
  newUser.roles = [role._id];

  const userCreated = await newUser.save();
  const userRol = await User.findById(userCreated._id).populate("roles");

  const userData = { id: userCreated._id };
  const token = await jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });

  //refresh token
  const refresh_token = await jwt.sign(userData, process.env.JWT_REFRESH, {
    expiresIn: 60 * 60 * 24,
  });

  if (userCreated) {
    const { _id, email, picture } = userCreated;
    const rol = userRol.roles[0].name;
    return res.status(200).json({
      success: true,
      user: { _id, picture, email, rol, token, refreshToken: refresh_token },
    });
  }

  return res.status(400).json({
    success: false,
    message: "err SignUp",
  });
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("roles");

  if (!user)
    return res.status(401).json({
      success: false,
      message: "user not foud, whit the given  email!",
    });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res
      .status(400)
      .json({ success: false, message: "email / password doest not match!" });

  const userData = { id: user._id, email: user.email };
  // generate first token
  const token = await jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });

  //refresh token
  const refresh_token = await jwt.sign(userData, process.env.JWT_REFRESH, {
    expiresIn: 60 * 60 * 24,
  });
  //
  const { name } = user.roles.pop();
  const { picture, _id, username } = user;
  return res.header("auth-token", token).json({
    success: true,
    error: null,
    user: {
      _id,
      picture,
      rol: name,
      username,
      email,
      token,
      refreshToken: refresh_token,
    },
  });
};

const UserConRoles = async (req, res) => {
  const { username, email, password, roles } = req.body;

  const user = await User.findOne({ email }).select("-password");
  if (user)
    return res.status(400).json({
      succes: false,
      error: true,
      message: "your email already exists",
    });

  const newUser = new User({
    username,
    email,
    password,
  });
  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role._id];
  }

  const result = await newUser.save();
  console.log(result);
  return res.status(200).json({
    sucess: true,
    error: null,
    message: "user created successfully",
  });
};

const UserId = async (req, res) => {
  const { _id } = req.params;
  if (_id !== req.id)
    return res
      .status(400)
      .json({ success: false, message: "error invalid token" });
  const result = await User.findById(_id).select("-password").populate("roles");
  console.log(result);

  const { email, FirstName, picture } = result;
  return res.status(200).json({
    success: true,
    email,
    FirstName,
    picture,
  });
};

const UpdateImageProfile = async (req, res) => {
  const { id } = req.params;
  //
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  //
  const { image } = req.files;
  //
  if (!image) {
    return res.status(400).json({
      error: true,
      message: "Error img not found",
    });
  }
  try {
    const user = await User.findById(id);
    // console.log("User Public id: %s", user.publicId);
    // console.log(user);
    if (user.publicId) {
      console.log("Image destroy:");
      await uploader.destroy(user.publicId);
    }
    const imageUpdate = await uploader.upload(image.tempFilePath);
    // new SingletonDelete();

    await remove(path.resolve("./tmp"));
    const { secure_url, public_id } = imageUpdate;

    await User.findByIdAndUpdate(
      id,
      {
        picture: secure_url,
        publicId: public_id,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    return res.status(200).json({
      error: false,
      message: "todo bien amigo",
      img: secure_url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Hubo un error",
    });
  }
};

// ########################################### //

const RefreshToken = async (req, res) => {
  const refreshToken = req.headers.refresh;
  if (!refreshToken) {
    return res.status(400).json({
      error: true,
      message: "something goes wrong",
    });
  }
  const verifyRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH);
  console.log(verifyRefresh);
  const { id } = verifyRefresh;

  try {
    // generate un new token y ultimo token
    const user = await User.findById(id);
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24,
      }
    );
    return res.status(200).json({
      error: false,
      message: "Todo bien",
      token: token,
    });
  } catch (_error) {
    console.error(_error);
    return res.status(400).json({
      error: true,
    });
  }
};

// const VerificacionRoles =  async (req,res)=>{
// }

const ForgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({
      error: true,
      messagge: "Email not found",
    });
  // verificacion   de email  si existe o no existe / refact. Middleware Global para verificar si existe los emails inp
  const validateEmail = validator.validate(email);
  if (!validateEmail)
    return res.status(400).json({
      error: true,
      message: "Email no exist",
    });
  // generate new password
  const PASSWORD_LENGTH = 12;
  // const LOWERCASE_ALPHABET = "abcdefghijklmnopqrstuvwxyz"; // 26 chars
  const UPPERCASE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 26 chars
  const NUMBERS = "0123456789"; // 10 chars
  // const SYMBOLS = ",./<>?;'\":[]\\|}{=-_+`~!@#$%^&*()"; // 32 chars
  const ALPHANUMERIC_CHARS = UPPERCASE_ALPHABET + NUMBERS; // 62 chars
  // const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS; // 94 chars
  console.log(generateRandomPassword(PASSWORD_LENGTH, ALPHANUMERIC_CHARS));

  const generatePassword = generateRandomPassword(
    PASSWORD_LENGTH,
    ALPHANUMERIC_CHARS
  );
  // before password => $2b$10$RpFYGdBAXGvUXzSE3sNahOhi1GmpjGjq0e20QvZt78jeEwVHg6tmm
  //Updated Password  Model User
  try {
    await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          password: generatePassword,
        },
      },
      {
        useFindAndModify: false,
      }
    );
    var mailOptions = {
      from: '"Example Team" <from@example.com>',
      to: `${email}`,
      subject: "Nice Nodemailer test",
      text: "Hey there, it’s our first message sent with Nodemailer ;) ",
      html: `<b>Hey there! </b><br> this is new password => ${generatePassword} `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    return res.status(500);
  }
  //send email new password with token

  return res.status(200).json({
    error: false,
    message: "All good",
  });
};

module.exports = {
  registerUser,
  signInUser,
  UserId,
  UserConRoles,
  UpdateImageProfile,
  RefreshToken,
  UpdateInformationUser,
  ForgotPassword,
  // VerificacionRoles,
};

function generateRandomPassword(length, alphabet) {
  var rb = crypto.randomBytes(length);

  var rp = "";

  for (var i = 0; i < length; i++) {
    rb[i] = rb[i] % alphabet.length;
    rp += alphabet[rb[i]];
  }

  return rp;
}
