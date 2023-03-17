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

const removeContent = (tuneArr) => {
  return tuneArr.map(({ content, ...rest }) => rest);
};

const checkContent = (contentArr) => {
  let isValid = true;
  contentArr.forEach((noteObj) => {
    let { note, duration, timing } = noteObj;
    if (!note || !duration) {
      isValid = false;
    }
    if (
      typeof note !== "string" ||
      typeof duration !== "string" ||
      typeof timing !== "number"
    ) {
      isValid = false;
    }
  });
  return isValid;
};

const checkGenreId = (id) => {
  const isValid = genres.find((genre) => genre.id === id);
  if (isValid) {
    return true;
  }
  return false;
};

const checkDuplicateGenre = (genreName) => {
  const isDuplicate = genres.find(
    (genre) => genre.genreName.toLowerCase() === genreName.toLowerCase()
  );
  if (isDuplicate) {
    return true;
  }
  return false;
};

// get/tunes
app.get(apiPath + version + "/tunes", (req, res) => {
  const tunesWithoutContent = removeContent(tunes);
  const { filter } = req.query;
  if (filter) {
    const genre = genres.find(
      (genre) => genre.genreName.toLowerCase() === filter.toLowerCase()
    );
    if (!genre) {
      return res.status(404).json([]);
    }
    const genreTunes = tunesWithoutContent.filter(
      (tune) => tune.genreId === genre.id
    );
    return res.status(200).json(genreTunes);
  }
  res.status(200).json(tunesWithoutContent);
});

// get/tunes/{id}
app.get(apiPath + version + "/tunes/:id", (req, res) => {
  const { id } = req.params;
  const tune = tunes.find((tune) => tune.id === id);
  if (!tune) {
    return res.status(404).send("Tune not found");
  }
  res.status(200).json(tune);
});

// post/tunes
app.post(apiPath + version + "/genre/:genreId/tunes", (req, res) => {
  try {
    const { name, content } = req.body;
    const { genreId } = req.params;
    if (!name || !content || !genreId) {
      return res
        .status(400)
        .json({ message: "A tune must have a name, content and genreId" });
    }
    if (content.length === 0) {
      return res.status(400).json({
        message: "A tune must have content that isn't an empty array",
      });
    }
    if (!checkContent(content)) {
      return res.status(405).json({
        message:
          "A tune must have valid content, with note, duration and timing",
      });
    }
    if (!checkGenreId(genreId)) {
      return res.status(404).json({
        message: "GenreId not found",
      });
    }
    const newTune = {
      id: nextTuneId.toString(),
      name: name,
      genreId: genreId,
      content: content,
    };

    tunes.push(newTune);
    nextTuneId++;
    return res.status(201).json(newTune);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error: Oops!" });
  }
});

// patch/tunes
app.patch(apiPath + version + "/genre/:oldGenreId/tunes/:id", (req, res) => {
  try {
    const { oldGenreId, id } = req.params;
    const { name, genreId, content } = req.body;

    if (!id && !name && !content && !oldGenreId && !genreId) {
      return res.status(400).json({ message: "No field changed" });
    }

    const tuneIndex = tunes.findIndex((tune) => tune.id == id);
    if (tuneIndex < 0) {
      return res
        .status(404)
        .json({ message: "Tune not found, unable to PATCH" });
    }

    if (oldGenreId !== tunes[tuneIndex].genreId) {
      return res
        .status(404)
        .json({ message: "Wrong genreId for tune, unable to PATCH" });
    }

    const updatedTune = { ...tunes[tuneIndex] };
    if (name) {
      updatedTune.name = name;
    }
    if (genreId && oldGenreId) {
      updatedTune.genreId = genreId;
    }
    if (content && content !== []) {
      updatedTune.content = content;
    }

    tunes[tuneIndex] = updatedTune;
    return res.status(200).json(tunes[tuneIndex]);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error: Oops!" });
  }
});

// get/genres
app.get(apiPath + version + "/genres", (req, res) => {
  res.status(200).json(genres);
});
// get/genres/{id}
app.get(apiPath + version + "/genres/:id", (req, res) => {
  const { id } = req.params;
  const genre = genres.find((genre) => genre.id === id);
  if (!genre) {
    return res.status(404).send("Genre not found");
  }
  res.status(200).json(genre);
});
// post/genres
app.post(apiPath + version + "/genres", (req, res) => {
  const { genreName } = req.body;
  if (!genreName) {
    return res
      .status(400)
      .json({ message: "genreName not provided in the request body" });
  }
  const isDup = checkDuplicateGenre(genreName);
  if (isDup) {
    return res
      .status(404)
      .json({ message: "Genre name not allowed, already exists" });
  }
  const newGenre = {
    id: nextGenreId.toString(),
    genreName: genreName,
  };
  genres.push(newGenre);
  nextGenreId++;
  return res.status(201).json(newGenre);
});

// delete/genres
app.delete(apiPath + version + "/genres/:genreId", (req, res) => {
  const { genreId } = req.params;
  if (!genreId) {
    return res
      .status(400)
      .json({ message: "genreId not provided as a parameter" });
  }
  const genre = genres.find((genre) => genreId === genre.id);
  if (!genre) {
    return res.status(404).json({ message: "Genre doesn't exist" });
  }
  const genreTunes = tunes.find((tune) => tune.genreId === genreId);
  if (genreTunes) {
    return res.status(400).json({ message: "Can't delete genre, in use" });
  }
  const genreIndex = genres.findIndex((genre) => genreId === genre.id);
  const deletedGenre = genres.splice(genreIndex, 1);
  res.status(200).json(deletedGenre);
});

// ping pong
app.get("/", (req, res) => {
  res.status(200).send("pong");
});

//default: not supported
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

//Start the server
app.listen(port, () => {
  console.log("Tune app listening on port: " + port);
});
