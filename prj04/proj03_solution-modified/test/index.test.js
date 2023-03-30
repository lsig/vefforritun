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
  test("GET /tunes", async () => {
    const res = await request(apiUrl).get("/api/v1/tunes");
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(2);
  });

  test("GET individual tune", async () => {
    const res = await request(apiUrl).get("/api/v1/genres/0/tunes/3");
    const { id, name, genreId, content } = res.body;
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(id).toEqual("3");
    expect(name).toEqual("Seven Nation Army");
    expect(genreId).toEqual("0");
    expect(content).toBeInstanceOf(Array);
  });

  // Do something weird
  test("GET /randomURL causes 405", async () => {
    const res = await request(apiUrl).get("/api/v1/randomUrl");
    expect(res).toHaveProperty("statusCode", 405);
  });
});
