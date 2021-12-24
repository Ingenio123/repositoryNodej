const request = require("request");
const axios = require("axios");
const paypal = require("paypal-rest-sdk");
const {
  addCourse,
  NewCache,
  DeleteCache,
} = require("../ControllerPago/ControllerPago");

// const Paypal = require("../../models/Paypal/Paypal");
/**
 * CREDENTIAL SANDBOX
 */
const CLIENT =
  "ATX86WmE3S9EsBsWVzrlL--Tz-hiu8yAEYHu6g3wBPaynpMrTzn_v4mwD-Z1lKvaN8Ql7Bh0Oe0cSnaX";
const SECRET =
  "EGk--ynC5_s1yZ09-HfD7n9roO0f-2-RdKVX4CJV4GRBLUf9xlGy8D6Clg8TzwkbGZJhnCTq-1_bqh6O";
const PAYPAL_API = "https://api-m.paypal.com"; // Live https://api-m.paypal.com - sandbox https://api-m.sandbox.paypal.com

const auth = { user: CLIENT, pass: SECRET };
const UrlClient = "https://www.ingeniolanguages.com"; // Live  https://www.ingeniolanguages.com  / sandbox http://localhost:3000

// paypal configure
paypal.configure({
  mode: "live", //'sandbox' or 'live'
  client_id: CLIENT,
  client_secret: SECRET,
});
//end configure paypal

const CreatePayment = async (req, res) => {
  const _id = req.id;
  console.log("este es el ID: ", _id);
  //  create new data cache

  const { datosArray, priceTotal } = req.body;
  // _id  del usuario y items de la compra //
  await NewCache(_id, datosArray);
  // console.log(datosArray, priceTotal);
  // console.log(DestructArray(datosArray));
  var create_payment_json = {
    intent: "SALE",
    payer: {
      payment_method: "paypal",
    },

    redirect_urls: {
      return_url: UrlClient + "/redirect",
      cancel_url: UrlClient + "/paypal/cancel",
    },
    transactions: [
      {
        item_list: {
          items: DestructArray(datosArray),
        },
        amount: {
          currency: "USD",
          total: priceTotal,
        },
        description: "Course comprado. Te deseamos exitos",
      },
    ],
  };

  // ################################################################################################################# //
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

  // try {
  //   const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
  //     auth,
  //     body,
  //     json: true,
  //   });
  //   console.log(response);
  //   res.status(200).json({ data: response.body });
  // } catch (error) {
  //   console.log(error.response.data);
  //   res.status(500).json({ err: "Error" });
  // }

  // ###################################################################################################################################### //

  // create payment
  //  create_payment_json
  paypal.payment.create(create_payment_json, function (err, payment) {
    if (err) {
      return res.status(400).json({ status: false, message: "Error" });
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

//  ################################

const PaymentSuccess = async (req, res) => {
  // const { token } = req.query;
  // const response = await axios.post(
  //   `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
  //   {
  //     auth,
  //     body: {},
  //     json: true,
  //   }
  // );
  // console.log(response);
  // return res.status(200).json({ data: response.body });
  const { paymentId } = req.query;
  const payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function (err, payment) {
    if (err) {
      throw err;
      return res.status(400).json({ status: false, message: "Error" });
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

const DestructArray = (arrayData) => {
  // let datos = [];
  // arrayData.map((item, i) => {
  //   datos.push(
  //     `{name: "${item.idiom}" ,sku: "item" ,price: ${item.price},currency:"USD",quanty:1}`
  //   );
  // });
  var result = arrayData.map((item) => ({
    name: item.idiom,
    sku: "item",
    description: "1 package of " + item.idiom + " of " + item.lesson,
    price: item.price,
    currency: "USD",
    quantity: 1,
  }));
  console.log(result);
  return result;
};

// `cart.items%5B${i}%5D.name=${item.idiom}&cart.items%5B${i}%5D.description=${item.lesson}&cart.items%5B${i}%5D.price=${item.price}&cart.items%5B${i}%5D.quantity=1`

// {
//   name: "item",
//   sku: "item",
//   price: "2",
//   currency: "USD",
//   quantity: 1,
// },
