const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const prefix = "/api";
const version = "/vEx0";
let nextNoteId = 3;

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

let notes = [
  { id: 1, name: "todos for today", content: "Prepare Lab 6", priority: 1 },
  {
    id: 2,
    name: "memo for l15",
    content: "Do not forget to mention Heroku",
    priority: 5,
  },
];

module.exports.resetServerState = function () {
  //Does nothing
};

app.get(prefix + version + "/notes", (req, res) => {
  const { greater_than } = req.query;
  if (greater_than && !isNaN(greater_than)) {
    const greaterArray = notes.filter(
      (note) => note.id > parseInt(greater_than)
    );
    return res.status(200).json(greaterArray);
  }
  return res.status(200).json(notes);
});

app.post(prefix + version + "/notes", (req, res) => {
  const { name, content, priority } = req.body;
  if (!name || !content || !priority) {
    return res
      .status(400)
      .send({ message: "A note must have a name, content and priority" });
  }
  if (
    typeof name !== "string" ||
    typeof content !== "string" ||
    typeof priority !== "number"
  ) {
    return res.status(400).send({
      message:
        "A note must have valid properties, a name which is string, content which is a string and a priority which is a number",
    });
  }

  const newNote = {
    id: nextNoteId,
    name: name,
    content: content,
    priority: priority,
  };
  notes.push(newNote);
  nextNoteId++;
  res.status(201).json(newNote);
});

app.delete(prefix + version + "/notes/:noteId", (req, res) => {
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id == req.params.noteId) {
      res.status(200).json(notes.splice(i, 1)[0]);
      return;
    }
  }
  res.status(404).json({
    message: "Note with id " + req.params.noteId + " does not exist.",
  });
});

//Default: Not supported
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

app.listen(port, () => {
  console.log("Todo note app listening on port " + port);
});
