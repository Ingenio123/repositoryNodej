const { Schema, model } = require("mongoose");
const { hash, genSalt, compare } = require("bcrypt");

const userSchema = new Schema(
  {
    FirstName: {
      type: String,
    },
    LastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    student: {
      type: Boolean,
      default: false,
    },
    googleAuth: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/ingenio/image/upload/v1623097143/avatar_eyqooo.png",
    },
    publicId: {
      type: String,
    },
    curses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    numberCell: {
      type: Number,
    },
    Gender: {
      type: String,
    },
    Country: {
      type: String,
    },
    CountryNationality: {
      type: String,
      default: "",
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    SecondEmail: {
      type: String,
    },
    democlass: {
      classDemo: { type: Boolean, default: false },
      requireDemo: { type: Boolean, default: false },
      nameTeacherDemo: { type: String },
    },
  },
  { timestamps: true }
);

/* ----------------------------------------------------------
    verificacion  si esta guardando el password encriptarlo  
------------------------------------------------------------- */

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); // => !true -> false  / !false -> true
  const salt = await genSalt(10);
  const hashPassword = await hash(user.password, salt);
  user.password = hashPassword;
  next();
});

// userSchema.pre("findOneAndUpdate", async function (sig) {
//   // console.log(this.getFilter());
//   const saltBcrypt = await genSalt(10);
//   const passwordHash = await hash(this.password, saltBcrypt);
//   this.password = passwordHash;
//   console.log("Update");
//   return sig();
// });

/* ----------------------------------------------------------
    methos de  password de comparacion de password  
------------------------------------------------------------- */

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

userSchema.plugin(require("mongoose-autopopulate"));
module.exports = model("User", userSchema);
