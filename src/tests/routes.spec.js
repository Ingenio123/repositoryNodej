const request = require("supertest");
const app = require("../index");

let token = "";
// beforeAll(async () => {
//   const response = await request(app).get("/authentication/test");
//   token = response.body.token;
// });

describe("crear una nueva peticion XHR/http post", async () => {
  const res = request(app)
    .post("/paypal/createPayment")
    .set("Authorization", `Bearer `);
  expect(response.statusCode).toBe(200);
});
