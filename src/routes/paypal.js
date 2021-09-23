const router = require("express").Router();
const {
  CreatePayment,
  cancel,
  PaymentSuccess,
} = require("../controllers/Paypal/Interger");

const paypal = require("paypal-rest-sdk");

// http://localhost:4000/paypal/createPayment [POST]
router.post("/paypal/createPayment", CreatePayment);
// router.get("paypal/sucess", PaymentSuccess);

router.get("/paypal/sucess", (req, res) => {
  console.log(req.query);
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function (error, payment) {
    if (error) {
      console.error(JSON.stringify(error));
    } else {
      if (payment.state == "approved") {
        //console.log(JSON.stringify(payment, null, '\t'));
        console.log("payment completed successfully");
        res.status(201).json({
          status: "success",
          payment: payment,
        });
        // res.send('Success');
      } else {
        res.status(400).json({
          status: "payment not successful",
          payment: {},
        });
      }
    }
  });
});
// router.get("/execute-payment", executePayment);
router.get("paypal/cancel", cancel);

module.exports = router;
