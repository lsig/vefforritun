// Import supertest for HTTP requests
const request = require("supertest");
// note that we take advantage of @jest/globals (describe, it, expect, etc.)
// API for expect can be found here: https://jestjs.io/docs/expect

const apiUrl = "http://localhost:3000";

describe("Endpoint tests", () => {
  // Make sure the server is in default state when testing
  beforeEach(async () => {
    await request(apiUrl).get("/api/v1/reset");
  });

  //###########################
  //Write your tests below here
  //###########################

  // Do something weird
  test("GET /randomURL causes 405", async () => {
    const res = await request(apiUrl).get("/api/v1/randomUrl");
    expect(res).toHaveProperty("statusCode", 405);
  });
});
