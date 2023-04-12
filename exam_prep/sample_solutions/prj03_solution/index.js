//Sample for Assignment 3
const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();

const apiPath = "/api/";
const version = "v1";

//Port environment variable
const port = 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//Set Cors-related headers to prevent blocking of local requests
// Do note that this should not be done in a production environment
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Our id counters
//We use basic integer ids here, but other solutions (such as UUIDs) would be better
let nextTuneId = 4;
let nextGenreId = 2;

//The following is an example of an array of two tunes.  Compared to assignment 2, I have shortened the content to make it readable
const tunes = [
  {
    id: "0",
    name: "Für Elise",
    genreId: "1",
    content: [
      { note: "E5", duration: "8n", timing: 0 },
      { note: "D#5", duration: "8n", timing: 0.25 },
      { note: "E5", duration: "8n", timing: 0.5 },
      { note: "D#5", duration: "8n", timing: 0.75 },
      { note: "E5", duration: "8n", timing: 1 },
      { note: "B4", duration: "8n", timing: 1.25 },
      { note: "D5", duration: "8n", timing: 1.5 },
      { note: "C5", duration: "8n", timing: 1.75 },
      { note: "A4", duration: "4n", timing: 2 },
    ],
  },

  {
    id: "3",
    name: "Seven Nation Army",
    genreId: "0",
    content: [
      { note: "E5", duration: "4n", timing: 0 },
      { note: "E5", duration: "8n", timing: 0.5 },
      { note: "G5", duration: "4n", timing: 0.75 },
      { note: "E5", duration: "8n", timing: 1.25 },
      { note: "E5", duration: "8n", timing: 1.75 },
      { note: "G5", duration: "4n", timing: 1.75 },
      { note: "F#5", duration: "4n", timing: 2.25 },
    ],
  },
];

const genres = [
  { id: "0", genreName: "Rock" },
  { id: "1", genreName: "Classic" },
];

//Tune endpoints
app.get(apiPath + version + "/tunes", (req, res) => {
  const tuneArray = [];

  if (!req.query.filter) {
    tunes.map((tune) =>
      tuneArray.push({ id: tune.id, name: tune.name, genreId: tune.genreId })
    );
  } else {
    const genreId = genres.findIndex(
      (genre) =>
        genre.genreName.toLowerCase() === req.query.filter.toLowerCase()
    );

    tunes.map((tune) => {
      if (parseInt(tune.genreId) === genreId) {
        tuneArray.push({ id: tune.id, name: tune.name, genreId: tune.genreId });
      }
    });
  }

  res.status(200).json(tuneArray);
});

app.get(apiPath + version + "/genres/:genreId/tunes/:tuneId", (req, res) => {
  const foundTune = tunes.find(
    (tune) =>
      parseInt(tune.id) === parseInt(req.params.tuneId) &&
      parseInt(tune.genreId) === parseInt(req.params.genreId)
  );

  // Fail fast
  if (!foundTune) {
    const tunewithId = tunes.find(
      (tune) => parseInt(tune.id) === parseInt(req.params.tuneId)
    );

    if (!tunewithId) {
      return res.status(400).json({
        message: `Tune with id ${req.params.tuneId} does not exist`,
      });
    }

    return res.status(400).json({
      message: `Tune with id ${req.params.tuneId} does not belong to genre with id ${req.params.genreId}.`,
    });
  }

  return res.status(200).json(foundTune);
});

app.post(apiPath + version + "/genres/:genreId/tunes", (req, res) => {
  if (
    !req.body ||
    !req.body.name ||
    typeof req.body.name !== "string" ||
    !req.body.content ||
    req.body.content.length <= 0 ||
    typeof req.body.content !== "object"
  ) {
    return res.status(400).json({
      message: "Tunes require at least a name, and a non-empty content array.",
    });
  }

  req.body.content.map((item) => {
    if (
      !item.note ||
      typeof item.note !== "string" ||
      !item.duration ||
      typeof item.duration !== "string" ||
      !item.timing ||
      typeof item.timing !== "number"
    ) {
      return res.status(400).json({
        message:
          "The tune content array needs objects with note, duration and timing properties only.",
      });
    }
  });

  const foundGenreId = genres.findIndex(
    (genre) => parseInt(genre.id) === parseInt(req.params.genreId)
  );

  if (foundGenreId < 0) {
    return res.status(404).json({
      message: "Genre with id " + req.params.genreId + " does not exist.",
    });
  }

  const newTune = {
    id: String(nextTuneId),
    name: String(req.body.name),
    genreId: foundGenreId,
    content: req.body.content,
  };

  tunes.push(newTune);
  nextTuneId++;

  return res.status(201).json(newTune);
});

app.patch(apiPath + version + "/genres/:genreId/tunes/:tuneId", (req, res) => {
  if (
    !req.body ||
    !req.body.name ||
    typeof req.body.name !== "string" ||
    (req.body.content &&
      (req.body.content.length <= 0 || typeof req.body.content !== "object"))
  ) {
    return res.status(400).json({
      message:
        "To update a tune, you need to provide a name, a non-empty content array, or a new genreId.",
    });
  }

  const foundTuneWithId = tunes.findIndex(
    (tune) => parseInt(tune.id) === parseInt(req.params.tuneId)
  );

  if (foundTuneWithId < 0)
    return res.status(404).json({
      message: "Tune with id " + req.params.tuneId + " does not exist.",
    });

  const foundTuneId = tunes.findIndex(
    (tune) =>
      parseInt(tune.id) === parseInt(req.params.tuneId) &&
      parseInt(tune.genreId) === parseInt(req.params.genreId)
  );

  if (foundTuneId < 0) {
    return res.status(400).json({
      message: `Tune with id ${req.params.tuneId} does not have genre id ${req.params.genreId}.`,
    });
  }

  if (req.body.genreId) {
    genreExists = genres.some(
      (genre) => parseInt(genre.id) === parseInt(req.body.genreId)
    );

    if (!genreExists) {
      return res.status(404).json({
        message: `Genre with id ${req.body.genreId} does not exist.`,
      });
    }

    tunes[foundTuneId].genreId = req.body.genreId;
  }

  if (req.body.name) {
    tunes[foundTuneId].name = req.body.name;
  }

  if (req.body.content && req.body.content.length > 0) {
    tunes[foundTuneId].content = req.body.content;
  }

  return res.status(200).json(tunes[foundTuneId]);
});

//Genre endpoints
app.get(apiPath + version + "/genres", (req, res) => {
  res.status(200).json(genres);
});

app.post(apiPath + version + "/genres", (req, res) => {
  if (
    !req.body ||
    !req.body.genreName ||
    typeof req.body.genreName !== "string"
  ) {
    return res.status(400).json({ message: "Genres require a genreName." });
  }

  const newGenre = {
    id: String(nextGenreId),
    genreName: String(req.body.genreName),
  };

  if (genres.some((genre) => genre.genreName === newGenre.genreName)) {
    return res.status(400).json({
      message: `A genre with name ${newGenre.genreName} already exists.`,
    });
  }

  genres.push(newGenre);
  nextGenreId++;

  res.status(201).json(newGenre);
});

app.delete(apiPath + version + "/genres/:genreId", (req, res) => {
  const deletedGenreId = genres.findIndex(
    (genre) => parseInt(genre.id) === parseInt(req.params.genreId)
  );

  // Fail fast
  if (deletedGenreId === -1) {
    return res.status(404).json({
      message: `Genre with id ${req.params.genreId} does not exist.`,
    });
  }

  const genreHasTunes = tunes.some(
    (tune) => parseInt(tune.genreId) === parseInt(req.params.genreId)
  );

  // Fail fast
  if (genreHasTunes) {
    return res.status(400).json({
      message: "Cannot delete genre, as it is used by at least one tune.",
    });
  }

  // Expected return
  const deletedGenre = genres[deletedGenreId];
  genres.splice(deletedGenreId, deletedGenreId + 1);
  return res.status(200).json(deletedGenre);
});

//Default: Not supported
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

// TODO: See assignment 4 for correct exporting when testing
app.listen(port, () => {
  console.log("Tunes app listening on Port: " + port);
});
