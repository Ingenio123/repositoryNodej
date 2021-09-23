const request = require("request");
const axios = require("axios");

const paypal = require("paypal-rest-sdk");

// const Paypal = require("../../models/Paypal/Paypal");
/**
 * CREDENTIAL SANDBOX
 */
const CLIENT =
  "AVyZDnugXSDNCiWSUc-8bJlK8oT_l0--7KKquM8_dODYZ2_kShQ7FWSbvEi9ZgxQodHHXhZBE_10ZX6l";
const SECRET =
  "ELtmvEHB8kMwL_fnwJl1r79G3IcRVC6gk8FPlhpbdvN5nzi1aokhI8533YdUy50IiugvqYbNXLyfml4Y";
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Live https://api-m.paypal.com

const auth = { user: CLIENT, pass: SECRET };
const UrlClient = "http://localhost:3000";

// paypal configure
paypal.configure({
  mode: "sandbox", //'sandbox' or 'live'
  client_id: CLIENT,
  client_secret: SECRET,
});
//end configure paypal

const CreatePayment = (req, res) => {
  const { priceTotal, name, description, quantity, price } = req.body;

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },

    redirect_urls: {
      return_url: UrlClient + "/redirect",
      cancel_url: UrlClient + "/paypal/cancel/",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: priceTotal,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: priceTotal,
        },
        description: "Course comprado. Te deseamos exitos",
      },
    ],
  };
  // const body = {
  //   intent: "CAPTURE",
  //   purchase_units: [
  //     {
  //       amount: {
  //         currency_code: "USD", //https://developer.paypal.com/docs/api/reference/currency-codes/
  //         value: "115",
  //       },
  //     },
  //   ],
  //   application_context: {
  //     brand_name: `MiTienda.com`,
  //     landing_page: "NO_PREFERENCE", // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
  //     user_action: "PAY_NOW", // Accion para que en paypal muestre el monto del pago
  //     return_url: `http://localhost:3000/redirect`, // Url despues de realizar el pago
  //     cancel_url: `http://localhost:3000/cancel-payment`, // Url despues de realizar el pago
  //   },
  // };

  // create payment

  paypal.payment.create(create_payment_json, function (err, payment) {
    if (err) {
      throw err;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          return res.status(201).json({
            status: "success",
            link: payment.links[i].href,
          });
        }
      }
    }
  });
};

const GenerateItems = () => {};

//  ################################

const PaymentSuccess = (req, res) => {
  const { paymentId } = req.query;
  const payerId = { payer_id: req.query.PayerID };
  console.log(req.query);
  paypal.payment.execute(paymentId, payerId, function (err, payment) {
    if (err) {
      throw err;
    } else {
      if (payment.state === "approved") {
        console.log("payment completed successsfully");
        return res.status(201).json({
          status: "Success",
          payment,
        });
      } else {
        return res.status(400).json({
          status: "payment not success",
          payment: {},
        });
      }
    }
  });
};

const cancel = (req, res) => {
  return res.status(201).json({
    status: "fail",
    message: "payment cancel",
  });
};

module.exports = {
  CreatePayment,
  PaymentSuccess,
  cancel,
};

// const datospago = {
//   intent: "sale",
//   purchase_units: [
//     {
//       description: "Course de ingneio languages",
//       amount: {
//         currency_code: "USD", //https://developer.paypal.com/docs/api/reference/currency-codes/
//         value: 20.0,
//       },
//     },
//   ],
//   application_context: {
//     brand_name: `ingeniolanguages.com`,
//     landing_page: "NO_PREFERENCE", // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
//     user_action: "PAY_NOW", // Accion para que en paypal muestre el monto del pago
//     return_url: UrlClient + "/redirect", // Url despues de realizar el pago
//     cancel_url: UrlClient + "/paypal/cancel/", // Url despues de cancela  el pago
//   },
// };
