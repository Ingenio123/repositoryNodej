const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const fileupload = require("express-fileupload");
const clouddinary = require("cloudinary").v2;
const { createRoles, createTypeMaterial } = require("./libs/initialSetup");
const db = require("./connectDB");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const graphql = require("graphql");
const { schema } = require("./models/roles");
const schemaGraphql = require("./graphql/schema");
require("dotenv").config();

const app = express();
db.conect_db();

createRoles();
createTypeMaterial();
//
require("./authGoogle");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// settings
app.set("port", process.env.PORT || 4000);

app.set("views", path.join(__dirname, "views"));

clouddinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDDINARY,
  api_secret: process.env.API_SECRET_CLOUDDINARY,
});
// middlewares
app.use(cors());

const whitelist = ["http://localhost:3000", "http://localhost:4000"];

const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by cors :( "));
    }
  },
};

//  -----------------------------
app.use(morgan("dev"));

app.use(
  fileupload({
    useTempFiles: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.engine(
  "handlebars",
  exphbs({
    extname: "handlebars",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: [
      //  path to your partials
      path.join(__dirname, "views/partials"),
    ],
  })
);

app.set("view engine", "handlebars");

// middleware passport
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const schemt = new graphql.GraphQLSchema({
  query: schemaGraphql.QueryRoot,
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemt,
    graphiql: true,
  })
);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/auth",
  passport.authenticate("google", {
    successRedirect: "/user",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/user", isLoggedIn, (req, res) => {
  return res.status(200).json({
    succes: true,
    data: {
      username: req.user.displayName,
      profileImage: req.user.picture,
    },
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  return res.status(201).json({
    succes: true,
    message: "logout succes",
  });
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});
// successRedirect: '/protected',
// failureRedirect: '/auth/google/failure'

// routes
app.use(require("./routes/index"));
app.use(require("./routes/paypal"));
app.use(require("./routes/temary"));
app.use(require("./routes/summay"));
app.use(require("./routes/verifyData"));
app.use("/feedback", require("./routes/feedback"));
app.use("/v1", require("./routes/ScoreExam"));
app.use("/v1", require("./routes/materials.routes"));
app.use("/v1", require("./routes/revies.routes"));
app.use("/v1", require("./routes/promo.routes"));
// static folder
app.use(express.static(path.join(__dirname, "public")));

// const {sendCheckOut2}  = require('./ConnectDatafast')
// sendCheckOut2();

// start server
app.listen(app.get("port"), () => {
  console.log(`server on port http://localhost:${app.get("port")}`);
});
