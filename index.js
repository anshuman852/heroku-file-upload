const express = require('express')
const app = express()
const Randomstring = require('randomstring')
const multer = require('multer')
const path = require('path')
const bodyParser = require("body-parser")
var fs = require('fs')
const router = express.Router()

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/')
  },
  filename: function (req, file, cb) {
    name = file.originalname.split('.')
    rend = Randomstring.generate(7)
    fs.mkdirSync('./files/' + rend)
    cb(null, rend + '/' + file.originalname)
  }
})
var uploads = multer({ storage: storage })
app.use(express.static('files'))

// routes 
app.get("/", (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.post("/upload", uploads.single("file"), function (req, res) {
  baseurl = "https://rekt-files.herokuapp.com/";
  res.send(baseurl + res.req.file.filename);
});

app.use("/", router)

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
