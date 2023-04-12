const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const prefix = "/api";
const version = "/vEx0";

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let notes = [{ id: 10, name: "todos for today", content: "Prepare Lab 6", priority: 1 }, { id: 12, name: "memo for l15", content: "Do not forget to mention Heroku", priority: 5 }];

module.exports.resetServerState = function () {
    //Does nothing
};

app.get(prefix + version + '/notes', (req, res) => {
    return res.status(200).json(notes);
});

app.delete(prefix + version + '/notes/:noteId', (req, res) => {
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id == req.params.noteId) {
            res.status(200).json(notes.splice(i, 1)[0]);
            return;
        }
    }
    res.status(404).json({ 'message': "Note with id " + req.params.noteId + " does not exist." });
});

//Default: Not supported
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});

app.listen(port, () => {
    console.log('Todo note app listening on port ' + port);
});