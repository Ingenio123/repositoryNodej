const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Role = require("../models/roles");

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
  const token = await jwt.sign(userData, "secret", { expiresIn: 60 * 60 * 24 });

  if (userCreated) {
    const { _id, email, picture } = userCreated;
    const rol = userRol.roles[0].name;
    return res.status(200).json({
      success: true,
      user: { _id, picture, email, rol, token },
    });
  }

  return res.status(200).json({
    success: false,
    message: "err SignUp",
  });
};

const signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email }).populate("roles");

  if (!user)
    return res.status(401).json({
      success: false,
      message: "user not foud, whit the given  email! ",
    });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res
      .status(400)
      .json({ success: true, message: "email / password doest not match!" });

  const userData = { id: user._id, email: user.email };

  const token = await jwt.sign(userData, "secret", { expiresIn: 60 * 60 * 24 });
  const { name } = user.roles.pop();
  const { picture, _id, username } = user;
  res.header("auth-token", token).json({
    success: true,
    error: null,
    user: { _id, picture, rol: name, username, email, token },
  });
};

const UserConRoles = async (req, res, next) => {
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

const UserId = async (req, res, next) => {
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

// const VerificacionRoles =  async (req,res)=>{
// }

module.exports = {
  registerUser,
  signInUser,
  UserId,
  UserConRoles,
  // VerificacionRoles,
};
