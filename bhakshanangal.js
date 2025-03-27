var express = require("express");
var cors = require("cors");
var app = express();
var bodyparser = require("body-parser");
var https = require("https")
var http = require('http')
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config()

//const options = {
//  key: fs.readFileSync('/etc/letsencrypt/live/srv442800.hstgr.cloud/fullchain.pem'), // Replace with the path to your private key
//  cert: fs.readFileSync('/etc/letsencrypt/live/srv442800.hstgr.cloud/privkey.pem'), // Replace with the path to your certificate
//};
// var privateKey = fs.readFileSync('/etc/ssl/private.key', 'utf8').toString();

// var certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8').toString();

// var ca = fs.readFileSync('/etc/ssl/ca_bundle.crt').toString();

// var options = { key: privateKey, cert: certificate, ca: ca };

// var server = https.createServer(options, app);
var server = http.createServer(app);
var io = require("socket.io")(server, {
  maxHttpBufferSize: 10e7,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(bodyparser.json());
app.use(cors());
app.use(express.static('./', {
  maxAge: '1d' // Cache images for one day
}));

app.all("/*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

var mainRoute = require("./router");
app.use("/bhakshanangal", mainRoute);

global.myVar = io;

require('./sockets/wish/wishcount')(io);

server.listen(3000, () => {
  console.log("server running on port 3000");
});
