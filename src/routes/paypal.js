const router = require("express").Router();
// CreatePayment,
// const { cancel, PaymentSuccess } = require("../controllers/Paypal/Interger");

const {
  CreatePayment,
  executePay,
} = require("../controllers/Paypal/IntegerCallApi");
//
const paypal = require("paypal-rest-sdk");
const { verifyToken } = require("../middlewares/verify");
const { addCourse } = require("../controllers/ControllerPago/ControllerPago");
const User = require("../models/user");

// http://localhost:4000/paypal/createPayment [POST]
router.post("/paypal/createPayment", verifyToken, CreatePayment);
// router.get("paypal/sucess", PaymentSuccess);

router.get("/paypal/sucess", verifyToken, executePay);
// router.get("/paypal/sucess", verifyToken, (req, res) => {
//   console.log(req.query);
//   const _id = req.id;
//   console.log("este es el id: ", _id);
//   var paymentId = req.query.paymentId;
//   var payerId = { payer_id: req.query.PayerID };

//   paypal.payment.execute(paymentId, payerId, async function (error, payment) {
//     if (error) {
//       console.error(JSON.stringify(error));
//     } else {
//       if (payment.state == "approved") {
//         //console.log(JSON.stringify(payment, null, '\t'));
//         console.log("payment completed successfully");
//         const { email } = await User.findById(_id);
//         await addCourse(email);
//         res.status(201).json({
//           status: "success",
//           payment: payment,
//         });
//         // res.send('Success');
//       } else {
//         res.status(400).json({
//           status: "payment not successful",
//           payment: {},
//         });
//       }
//     }
//   });
// });
// router.get("/execute-payment", executePayment);
// router.get("paypal/cancel", cancel);

module.exports = router;
