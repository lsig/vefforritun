const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const prefix = "/api";
const version = "/v1";

let eateryId = 4;

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let eateries = [
  {
    id: 1,
    name: "Tjörnin",
    description: "Best goose in town",
    location: { lat: 64.145928, lng: -21.940736 },
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tj%C3%B6rnin%2C_Reykjavik.jpg/320px-Tj%C3%B6rnin%2C_Reykjavik.jpg",
  },
  {
    id: 3,
    name: "Elliðaárdalur",
    description: "Tasty rabbit.",
    location: { lat: 64.1150903, lng: -21.8417715 },
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Ellirardalur10.JPG/320px-Ellirardalur10.JPG",
  },
];

app.get(prefix + version + "/eateries", (req, res) => {
  let { start, limit } = req.query;
  start = parseInt(start);
  limit = parseInt(limit);

  start = isNaN(start) ? 0 : start;
  limit = isNaN(limit) || limit <= 0 ? 10 : limit;

  return res.status(200).json(eateries.slice(start, start + limit));
});

app.post(prefix + version + "/eateries", (req, res) => {
  const { name, description, location, logo } = req.body;
  if (!name || !description || !location || !logo) {
    return res.status(400).send({
      message: "Eatery must have a valid name, description, location and logo",
    });
  }
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof logo !== "string"
  ) {
    return res
      .status(400)
      .send({ message: "Name, description and logo must be strings" });
  }

  const { lat, lng } = location;
  if (!lat || !lng) {
    return res
      .status(400)
      .send({ message: "location must have lat and lng fields" });
  }
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return res.status(400).send({
      message:
        "lat or lng not set right, either the value is to large or small",
    });
  }
  const isNotUnique = eateries.some((eatery) => {
    return eatery.name === name;
  });

  if (isNotUnique) {
    return res.status(400).send({ message: "name needs to unique" });
  }

  const newEatery = {
    id: eateryId,
    name: name,
    description: description,
    location: location,
    logo: logo,
  };

  eateries.push(newEatery);
  eateryId++;
  return res.status(200).json(newEatery);
});

app.delete(prefix + version + "/eateries/:eatId", (req, res) => {
  for (let i = 0; i < eateries.length; i++) {
    if (eateries[i].id == req.params.eatId) {
      res.status(200).json(eateries.splice(i, 1)[0]);
      return;
    }
  }
  res.status(404).json({
    message: "Eatery with id " + req.params.eatId + " does not exist.",
  });
});

//Default: Not supported
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

app.listen(port, () => {
  console.log("Eatery app listening on port " + port);
});
