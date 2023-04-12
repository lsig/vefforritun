// Import supertest for HTTP requests
const request = require("supertest");
// note that we take advantage of @jest/globals (describe, it, expect, etc.)
// API for expect can be found here: https://jestjs.io/docs/expect

const apiUrl = "http://localhost:3000";
const apiPath = "/api/";
const version = "v1";

describe("Endpoint tests", () => {
  // Make sure the server is in default state when testing
  beforeEach(async () => {
    await request(apiUrl).get("/api/v1/reset");
  });

  //###########################
  //Write your tests below here
  //###########################
  test("GET all tunes is succesful", async () => {
    const res = await request(apiUrl).get(apiPath + version + "/tunes");
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(2);
  });

  test("GET an individual tune should be succesful", async () => {
    const res = await request(apiUrl).get(
      apiPath + version + "/genres/0/tunes/3"
    );
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("id", "3");
    expect(res.body).toHaveProperty("name", "Seven Nation Army");
    expect(res.body).toHaveProperty("genreId", "0");
    expect(res.body).toHaveProperty("content");
    expect(res.body.content).toBeInstanceOf(Array);
  });

  test("GET an individual tune should fail when tune id does not exist", async () => {
    const res = await request(apiUrl).get(
      apiPath + version + "/genres/0/tunes/4"
    );
    expect(res.status).toBe(404);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual("Tune with id 4 does not exist.");
  });

  test("PATCH a tune works", async () => {
    const updatedSong = {
      name: "TNT",
      genreId: "0",
      content: [
        {
          note: "E5",
          duration: "4n",
          timing: 0,
        },
      ],
    };

    const res = await request(apiUrl)
      .patch(apiPath + version + "/genres/1/tunes/0")
      .send(updatedSong);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("id", "0");
    expect(res.body).toHaveProperty("name", "TNT");
    expect(res.body).toHaveProperty("genreId", "0");
    expect(res.body).toHaveProperty("content");
    expect(res.body.content).toBeInstanceOf(Array);
    expect(res.body.content.length).toEqual(1);
  });

  test("PATCH a tune fails when the genreId provided is wrong", async () => {
    const updatedSong = {
      name: "TNT",
      genreId: "0",
      content: [
        {
          note: "E5",
          duration: "4n",
          timing: 0,
        },
      ],
    };

    const res = await request(apiUrl)
      .patch(apiPath + version + "/genres/0/tunes/0")
      .send(updatedSong);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "Tune with id 0 does not have genre id 0."
    );
  });

  test("PATCH a tune fails when the provided properties are wrong", async () => {
    const updatedSong = {
      genreName: "TNT",
      genreIdNumber: "0",
      contentSong: [
        {
          note: "E5",
          duration: "4n",
          timing: 0,
        },
      ],
    };

    const res = await request(apiUrl)
      .patch(apiPath + version + "/genres/1/tunes/0")
      .send(updatedSong);

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "To update a tune, you need to provide a name, a non-empty content array, or a new genreId."
    );
  });

  test("POST new tune fails when the content property is missing", async () => {
    const newSong = {
      name: "TNT",
    };
    const res = await request(apiUrl)
      .post(apiPath + version + "/genres/0/tunes")
      .send(newSong);
    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual(
      "Tunes require at least a name, and a non-empty content array."
    );
  });

  test("POST new genre fails when auth is missing", async () => {
    const newGenre = {
      genreName: "R&B",
    };
    const res = await request(apiUrl)
      .post(apiPath + version + "/genres")
      .send(newGenre);
    expect(res.status).toBe(401);
    expect(res.body).toBeDefined();
    expect(res.body.message).toEqual("Unauthorized");
  });

  test("Replay attack works when POST-ing to genres", async () => {
    const newGenre = {
      genreName: "R&B",
    };
    const res = await request(apiUrl)
      .post(apiPath + version + "/genres")
      .set(
        "Authorization",
        "HMAC f1a71952d1c9d661edf9fe8825ee711b6dc07408903de1e763a58baa0eda82fc"
      )
      .send(newGenre);
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
  });
  // Do something weird
  test("GET /randomURL causes 405", async () => {
    const res = await request(apiUrl).get("/api/v1/randomUrl");
    expect(res).toHaveProperty("statusCode", 405);
  });
});
