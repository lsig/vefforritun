const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");

const { stringifyDivision } = require("./math");

const app = express();
const apiPath = "/api/";
const version = "v1";

const port = 3000;

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

app.get(apiPath + version + "/divide", (req, res) => {
  let { a, b } = req.query;
  a = parseInt(a);
  b = parseInt(b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(405).send("Operation not supported");
  }
  if (typeof a === "number" && typeof b === "number" && b !== 0) {
    return res.status(200).send(stringifyDivision(a, b));
  }

  return res.status(405).send("Operation not supported");
});

//default: not supported
app.use("*", (req, res) => {
  res.status(405).send("Operation not supported.");
});

//Start the server
app.listen(port, () => {
  console.log("Tune app listening on port: " + port);
});
