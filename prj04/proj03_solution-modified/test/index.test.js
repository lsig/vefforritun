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

  test("GET individual tune fails, id not found", async () => {
    const res = await request(apiUrl).get("/api/v1/genres/0/tunes/10");
    expect(res.status).toBe(404);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBe("Tune with id 10 does not exist.");
  });

  test("PATCH individual tunes", async () => {
    const updatedTune = {
      name: "Ave Maria",
      genreId: "1",
      content: [
        {
          note: "E5",
          duration: "8n",
          timing: 0,
        },
      ],
    };

    const res = await request(apiUrl)
      .patch("/api/v1/genres/0/tunes/3")
      .send(updatedTune);

    const { id, name, genreId, content } = res.body;

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(id).toEqual("3");
    expect(name).toEqual("Ave Maria");
    expect(genreId).toEqual("1");
    expect(content).toBeInstanceOf(Array);
    expect(content).toEqual([
      {
        note: "E5",
        duration: "8n",
        timing: 0,
      },
    ]);
  });

  test("PATCH individual tunes fails since genreId is wrong", async () => {
    const updatedTune = {
      name: "Ave Maria",
      genreId: "1",
      content: [
        {
          note: "E5",
          duration: "8n",
          timing: 0,
        },
      ],
    };

    const res = await request(apiUrl)
      .patch("/api/v1/genres/2/tunes/3")
      .send(updatedTune);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "Tune with id 3 does not have genre id 2."
    );
  });

  test("PATCH individual tunes fails since properties are wrong", async () => {
    const updatedTune = {
      message: "Ave Maria",
      id: "1",
      arr: [1, 2, 3],
    };

    const res = await request(apiUrl)
      .patch("/api/v1/genres/0/tunes/3")
      .send(updatedTune);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "To update a tune, you need to provide a name, a non-empty content array, or a new genreId."
    );
  });

  test("POST fails because content property array is empty", async () => {
    const newTune = {
      name: "Ave Maria",
      content: [],
    };
    const res = await request(apiUrl)
      .post("/api/v1/genres/1/tunes")
      .send(newTune);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "Tunes require at least a name, and a non-empty content array."
    );
  });

  test("POST fails because content property is not provided", async () => {
    const newTune = {
      name: "Ave Maria",
    };
    const res = await request(apiUrl)
      .post("/api/v1/genres/1/tunes")
      .send(newTune);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "Tunes require at least a name, and a non-empty content array."
    );
  });
  // Do something weird
  test("GET /randomURL causes 405", async () => {
    const res = await request(apiUrl).get("/api/v1/randomUrl");
    expect(res).toHaveProperty("statusCode", 405);
  });
});
