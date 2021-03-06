const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
const User = require("../models/user");
const Role = require("../models/roles");

const GoogleAuth = async (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  try {
    const result = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT,
    });
    const { email_verified, email, picture } = result.payload;

    if (email_verified) {
      const user = await User.findOne({ email })
        .select("-password")
        .populate("roles");

      if (user) {
        // Generate new token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });

        //refresh token
        const refresh_token = await jwt.sign(
          { id: user._id },
          process.env.JWT_REFRESH,
          {
            expiresIn: 60 * 60 * 24,
          }
        );

        const rol = getLastArrItem(user.roles);
        // const rol = user.roles[0].name;
        const { _id, email, username, picture } = user;

        return res.status(200).json({
          success: true,
          user: {
            _id,
            email,
            username,
            picture,
            rol: rol.name,
            token,
            refreshToken: refresh_token,
          },
        });
      } else {
        let password = email + "secret";
        const newuser = new User({
          email,
          password,
          picture,
          googleAuth: true,
        });
        console.log("Nuevo Usuario", newuser);
        const role = await Role.findOne({ name: "user" });
        newuser.roles = [role._id];

        newuser.save(async (err, data) => {
          if (err) {
            console.log("Error de google", err);
            return res.status(400).json({
              success: false,
              error: "Error sign In whith google",
            });
          }

          const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
            expiresIn: "120",
          });
          //refresh token
          const refresh_token = await jwt.sign(
            { id: data._id },
            process.env.JWT_REFRESH,
            {
              expiresIn: 60 * 60 * 24,
            }
          );
          const resultado = await User.findById(data._id).populate("roles");

          const rol = resultado.roles[0].name;
          const { _id, email, FirstName, picture } = data;
          return res.json({
            success: true,
            user: {
              _id,
              email,
              FirstName,
              picture,
              rol,
              token,
              refreshToken: refresh_token,
            },
          });
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: "google login failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      success: false,
    });
  }
};

const getLastArrItem = (arr) => {
  let lastItem = arr[arr.length - 1];
  console.log(`Last element is ${lastItem}`);
  return lastItem;
};

module.exports = {
  GoogleAuth,
};
