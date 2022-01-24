const axios = require("axios");
const request = require("request-promise");
const UrlClient = process.env.URL_CLIENT;
const User = require("../../models/user");
const { addCourse, NewCache } = require("../ControllerPago/ControllerPago");
//
const auth = {
  user: process.env.PAYPAL_CLIENT,
  pass: process.env.PAYPAL_SECRET,
};
const PAYPAL_API = process.env.PAYPAL_API; // Live https://api-m.paypal.com
const CreatePayment = async (req, res) => {
  const { datosArray, priceTotal } = req.body;
  const _id = req.id;
  await NewCache(_id, datosArray);
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD", //https://developer.paypal.com/docs/api/reference/currency-codes/
          value: `${priceTotal}`,
        },
      },
    ],
    application_context: {
      brand_name: `Ingenio Languages`,
      landing_page: "NO_PREFERENCE", // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
      user_action: "PAY_NOW", // Accion para que en paypal muestre el monto del pago
      return_url: `${UrlClient}/redirect`, // Url despues de realizar el pago
      cancel_url: `${UrlClient}/paypal/cancel`, // Url despues de realizar el pago
    },
  };

  const response = await request.post(`${PAYPAL_API}/v2/checkout/orders`, {
    auth,
    body,
    json: true,
  });
  for (let i = 0; i < response.links.length; i++) {
    if (response.links[i].rel === "approve") {
      console.log("APROVADO:", response.links[i].href);
      return res.status(201).json({
        status: "success",
        link: response.links[i].href,
      });
    }
  }

  // if (err) {
  //   return res.status(400).json({
  //     error: true,
  //     message: "Error",
  //   });
  // }
  // for (let i = 0; i < response.body.links.length; i++) {
  //   if (response.body.links[i].rel === "approve") {
  //     console.log("APROVADO:", response.body.links[i].href);
  //     return res.status(201).json({
  //       status: "success",
  //       link: response.body.links[i].href,
  //     });
  //   }
  // }
};

const executePay = async (req, res) => {
  const { token } = req.query;
  const _id = req.id;
  const response = await request.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {
      auth,
      body: {},
      json: true,
    }
  );
  const { email } = await User.findById(_id);
  await addCourse(email);
  return res.status(200).json({ data: response });
};

module.exports = {
  CreatePayment,
  executePay,
};
