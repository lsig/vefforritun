//Sample for Assignment 3
const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const app = express();
const apiPath = "/api/";
const version = "v1";
const port = 3000;

let nextTuneId = 2;
let nextGenreId = 2;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//Set Cors-related headers to prevent blocking of local requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//The following is an example of an array of two tunes.The content has been shortened to make it readable
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
    id: "1",
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

const checkContent = (content) => {
  return content.every(
    (obj) =>
      obj.hasOwnProperty("note") &&
      typeof obj.note === "string" &&
      obj.hasOwnProperty("duration") &&
      typeof obj.duration === "string" &&
      obj.hasOwnProperty("timing") &&
      typeof obj.timing === "number"
  );
};

const checkGenreId = (genreId) => {
  return genres.some((genre) => genre.id === genreId);
};

//Tunes

//Get all tunes
app.get(apiPath + version + "/tunes", (req, res) => {
  const { filter } = req.query;
  const tunesWithoutContent = tunes.map(({ id, name, genreId }) => ({
    id,
    name,
    genreId,
  }));

  if (filter) {
    const genre = genres.find(
      (genre) => genre.genreName.toLowerCase() === filter.toLowerCase()
    );
    if (!genre) {
      return res.status(200).json([]);
    }
    const filteredTunes = tunesWithoutContent.filter(
      (tune) => genre.id === tune.genreId
    );
    return res.status(200).json(filteredTunes);
  }
  return res.status(200).json(tunesWithoutContent);
});

//Get individual tune
app.get(apiPath + version + "/tunes/:id", (req, res) => {
  const { id } = req.params;
  const tune = tunes.find((t) => t.id === id);
  if (!tune) {
    return res.status(404).send({ message: "Tune not found" });
  }
  return res.status(200).json(tune);
});

//Post tune
app.post(apiPath + version + "/genre/:genreId/tunes", (req, res) => {
  const { name, content } = req.body;
  const { genreId } = req.params;

  if (!name || !content || !genreId) {
    return res
      .status(400)
      .send({ message: "name, content or genreId invalid" });
  }

  if (typeof name !== "string") {
    return res.status(400).send({ message: "name must be a string" });
  }

  if (!checkContent(content) || content.length === 0) {
    return res.status(400).send({
      message:
        "tune must have an none empty content array with the properties: note, duration and timing",
    });
  }

  if (!checkGenreId(genreId)) {
    return res.status(400).send({ message: "GenreId invalid, does not exist" });
  }

  const newTune = {
    id: nextTuneId.toString(),
    name: name,
    genreId: genreId,
    content: content,
  };
  tunes.push(newTune);
  nextTuneId++;
  res.status(201).json(newTune);
});

app.patch(apiPath + version + "/genre/:oldGenreId/tunes/:id", (req, res) => {
  const { name, genreId, content } = req.body;
  const { oldGenreId, id } = req.params;
  const tune = tunes.find((tune) => tune.id === id);
  const tuneIndex = tunes.findIndex((tune) => tune.id === id);
  const doesGenreIdExist = genres.some((genre) => genre.id === genreId);

  if (!name && !genreId && !content) {
    return res
      .status(400)
      .send({ message: "No property changed (name, genreId or conten)" });
  }
  if (tune.genreId !== oldGenreId) {
    return res
      .status(400)
      .send({ message: "URL genreId does not match the song id" });
  }
  if (name && typeof name !== "string") {
    return res.status(400).send({ message: "Name must be a string" });
  }
  if (genreId && typeof genreId !== "string") {
    return res.status(400).send({ message: "GenreId must be a string" });
  }
  if (!doesGenreIdExist) {
    return res.status(400).send({ message: "new genreId does not exist" });
  }
  if (content && !Array.isArray(content)) {
    return res
      .status(400)
      .send({ message: "content must be a non-empty array" });
  }
  if (content && (!checkContent(content) || content.length === 0)) {
    return res.status(400).send({
      message:
        "content must be a non-empty array, with objects that have the properties; note, duration and timing",
    });
  }

  if (name) {
    tune.name = name;
  }
  if (genreId) {
    tune.genreId = genreId;
  }
  if (content) {
    tune.content = content;
  }
  res.status(200).json(tunes[tuneIndex]);
});

//Genres

//Get all genres
app.get(apiPath + version + "/genres", (req, res) => {
  return res.status(200).json(genres);
});

//Get individual genre
app.get(apiPath + version + "/genres/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === req.params.id);
  if (!genre) {
    return res.status(404).send({ message: "genre id does not exist" });
  }
  res.status(200).json(genre);
});

//Post a new genres
app.post(apiPath + version + "/genres", (req, res) => {
  const { genreName } = req.body;

  if (!genreName) {
    return res
      .status(400)
      .send({ message: "request body must have a genreName" });
  }

  if (typeof genreName !== "string") {
    return res.status(400).send({ message: "genreName must be a string" });
  }

  if (
    genres.some(
      (genre) => genre.genreName.toLowerCase() === genreName.toLowerCase()
    )
  ) {
    return res.status(400).send({ message: "genreName already exists" });
  }

  const newGenre = {
    id: nextGenreId.toString(),
    genreName: genreName,
  };
  genres.push(newGenre);
  nextGenreId++;
  res.status(201).json(newGenre);
});

app.delete(apiPath + version + "/genres/:genreId", (req, res) => {
  const { genreId } = req.params;

  if (!genreId) {
    return res.status(400).send({ message: "genreId not provided" });
  }

  const doesGenreExist = genres.some((genre) => genre.id === genreId);

  if (!doesGenreExist) {
    return res
      .status(400)
      .send({ message: "genreId is not valid, does not exist" });
  }

  const isGenreInUse = tunes.some((tune) => tune.genreId === genreId);

  if (isGenreInUse) {
    return res.status(400).send({ message: "Cannot delete genre, in use" });
  }

  const genreIndex = genres.findIndex((genre) => genre.id === genreId);
  const deletedGenre = genres.splice(genreIndex, 1);
  res.status(200).json(deletedGenre);
});

//Default
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

//Start the server
app.listen(port, () => {
  console.log("Tune app listening on port: " + port);
});
