const router = require("express").Router();
const {
  VerfyUserData,
  VerifyDemoClass,
  GetDataUser,
  AddDataUserDemoclass,
  AddDataUserOneData,
} = require("../controllers/controllerVerifyData/verifyUserdata");

const { verifyToken } = require("../middlewares/verify");

router.get("/verifyData/:id", VerfyUserData);
router.get("/democlass", verifyToken, VerifyDemoClass);
/**
 * @VerifyDemoClass
 * @HTTP__GET
 * headers: `Bearer ${token}`
 * status: 200 😃
 */
router.get("/getdataDemoclass", verifyToken, GetDataUser);
// >>---------------->> 👀 POST 👀  <<---------------------<<
router.post("/addDataDemo", AddDataUserDemoclass);
router.post("/addDataDemoOne", verifyToken, AddDataUserOneData);

module.exports = router;
