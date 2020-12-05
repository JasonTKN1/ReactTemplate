const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8888;
var token = "";
const secret = "supersecret";
var branchCodeDict = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var upload = multer();
app.use(upload.any());
app.use(cors());

for (var i = 1; i <= 391; i++) {
  var str = i.toString();
  var actual = "";
  for (var j = str.length; j < 3; j++) {
    actual += "0";
  }
  actual += str;
  branchCodeDict[actual] = actual;
}

// Register the home route that displays a welcome message
// This route can be accessed without a token
app.get("/", function (req, res) {
  res.send("Welcome to our API");
});

app.post("/login", function (req, res) {
  console.dir(req.body);
  if (req.body["username"] == undefined || req.body["password"] == undefined) {
    res.status(400).send("The request parameters are incorrect");
  } else if (req.body["username"] == "" || req.body["password"] == "") {
    res.status(401).send("Missing credentials");
  } else if (
    req.body["username"] != "aws" ||
    req.body["password"] != "aws"
  ) {
    res.status(403).send("Credentials provided are invalid");
  } else {
    token = jwt.sign({ username: req.body["username"] }, secret, {
      expiresIn: 10,
    });
    res.send(token);
    //console.log(jwt.decode(token))
  }
});

// Register the route to get a new token
// will generate a new token that is valid for 2 minutes
// Login
app.post("/query/login", function (req, res) {
  console.dir(req.body);

  if (
    req.query["username"] == undefined ||
    req.query["password"] == undefined
  ) {
    res.status(400).send("The request parameters are incorrect");
  } else if (req.query["username"] == "" || req.query["password"] == "") {
    res.status(401).send("Missing credentials");
  } else if (
    req.query["username"] != "alpha" ||
    req.query["password"] != "alpha"
  ) {
    res.status(403).send("Credentials provided are invalid");
  } else {
    token = jwt.sign({ username: req.query["username"] }, secret, {
      expiresIn: 10,
    });
    res.send(token);
    //console.log(jwt.decode(token))
  }
});

// Extend
app.get("/extendSession", function (req, res) {
  //console.log(req.headers);
  //console.log(req.headers["authorization"]);
  if (req.headers["authorization"] == undefined) {
    res.status(400).send("The request parameters are incorrect");
  } else if (req.headers["authorization"] == "") {
    res.status(401).send("Missing credentials");
  } else {
    let bearer = req.headers["authorization"].split(" ");
    let tokenCheck = bearer[1];
    console.log(tokenCheck);

    jwt.verify(tokenCheck, secret, (err, authorizedData) => {
      if (err) {
        res.status(403).send("Credentials provided are invalid");
      } else {
        //If token is successfully verified
        token = jwt.sign({ username: "aws" }, secret, { expiresIn: 1200 });
        res.send(token);
      }
    });
  }
});

app.post("/validateForm", upload.any(), function (req, res) {
  // console.log(JSON.parse(JSON.stringify(req.body)));
  // console.log(req.body)
  console.log(req.body);
  console.log("Headers " + req.headers["authorization"]);
  if (
    req.headers["authorization"] == undefined ||
    req.body["customerName"] == undefined || 
    req.body["customerAge"] == undefined ||
    req.body["serviceOfficerName"] == undefined ||
    req.body["NRIC"] == undefined ||
    req.body["registrationTime"] == undefined ||
    req.body["branchCode"] == undefined ||
   // req.body["image"] == undefined ||
    req.body["productType"] == undefined
  ) {
    res.status(400).send("The request parameters are incorrect");
  } else if (
    req.headers["authorization"] == ""
    /*||
    req.query["customerName"] == "" ||
    req.query["customerAge"] == "" ||
    req.query["serviceOfficerName"] == "" ||
    req.query["NRIC"] == "" ||
    req.query["registrationTime"] == "" ||
    req.query["branchCode"] == "" ||
    req.query["image"] == "" ||
    req.query["productType"] == ""*/
  ) {
    res.status(401).send("Missing credentials");
  } else {
    let bearer = req.headers["authorization"].split(" ");
    let tokenCheck = bearer[1];
    jwt.verify(tokenCheck, secret, (err, authorizedData) => {
      if (err) {
        res.status(403).send("Credentials provided are invalid");
      } else {
        //console.log(req.query["NRIC"]);
        //If token is successfully verified
        if (
          req.query["customerName"].length > 64 ||
          req.query["serviceOfficerName"].length > 64 ||
          isNaN(parseInt(req.query["customerAge"])) ||
          parseInt(req.query["customerAge"]) < 18 ||
          checkNRIC(req.query["NRIC"]) == false ||
          checkTime(req.query["registrationTime"]) == false ||
          checkBranchCode(req.query["branchCode"]) == false
        ) {
          res.status(400).send("The request parameters are incorrect");
        } else {
          res.status(200).send("OK");
        }
      }
    });
  }
});

function checkNRIC(nric) {
  var firstCharacter = nric.charAt(0);
  var lastCharacter = nric.charAt(nric.length - 1);

  if (
    firstCharacter.toUpperCase() == firstCharacter.toLowerCase() ||
    lastCharacter.toUpperCase() == lastCharacter.toLowerCase() ||
    firstCharacter != firstCharacter.toUpperCase() ||
    lastCharacter != lastCharacter.toUpperCase()
  ) {
    return false;
  }

  if (nric.length - 2 != 7) {
    return false;
  }
  for (var i = 1; i < nric.length - 1; i++) {
    if (isNaN(parseInt(nric.charAt(i)))) {
      return false;
    }
  }
  return true;
}

function checkTime(time) {
  //{ DD/MM/YYYY HH:mm:ss }
  var matches = time.match(
    /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/
  );
  if (matches == null) {
    return false;
  }
  return true;
}

function checkBranchCode(branchCode) {
  if (!branchCode in branchCodeDict) {
    return false;
  }
  return true;
}

app.listen(port, () => console.log(`Listening on port ${port}`));