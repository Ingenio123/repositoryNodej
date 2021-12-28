const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Roles = require("../models/roles");

exports.verifyToken = async (req, res, next) => {
  const autorization = req.headers["authorization"];
  const token = autorization.split(" ")[1];

  if (!token)
    return res.status(401).json({ success: false, message: "token  not fund" });
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decode.id;
    next();
  } catch (error) {
    return res.status(400).json({
      error: true,
      expired: true,
      message: "expired token",
    });
  }
};
exports.verifyEmail = async (req, res, next) => {
  const userEmail = await User.findOne({ email: req.body.email });
  if (userEmail) {
    return res.status(401).json({
      success: false,
      message: "Email  ya existe ",
    });
  }
  return next();
};

exports.verifyAge = (req, res, next) => {
  if (req.body.age > 6 && req.body.age < 85) return next();
  return res.status(401).json({
    success: false,
    message: " age not accepted",
  });
};

exports.verifyIsAdmin = async (req, res, next) => {
  const user = await User.findById(req.id);
  const roles = await Roles.find({ _id: { $in: user.roles } });

  for (i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }

  return res.status(401).json({
    success: false,
    message: "necesitas ser admin",
  });
};

exports.verifyIsStudent = async (req, res, next) => {
  const user = await User.findById(req.id).populate("roles");
  const roles = await Roles.find({ _id: { $in: user.roles } });

  for (i = 0; i < roles.length; i++) {
    if (roles[i].name === "student") {
      next();
      return;
    }
  }

  return res.status(400).json({
    success: false,
    message: "necesitas ser student",
  });
};

// verify si es teacher o no
exports.verifyIsTeacher = async (req, res, next) => {
  const userTeacher = await User.findById(req.id);
  const rol = await Roles.find({ _id: { $in: userTeacher.roles } });

  for (i = 0; i < rol.length; i++) {
    if (rol[i].name === "teacher") {
      next();
      return;
    }
  }
  return res.status(401).json({
    success: false,
    message: "you are not a teacher",
  });
};
