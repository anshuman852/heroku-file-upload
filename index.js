const express = require("express");
const app = express();
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    name = file.originalname.split(".");
    cb(
      null,
      name[0] + "-" + Math.floor(Math.random() * 1000 + 1) + "." + name[1]
    );
  },
});

var uploads = multer({ storage: storage });
app.use("/files", express.static("files"));
app.get("/", (req, res) => res.send("Hello World!"));
app.post("/upload", uploads.single("file"), function (req, res) {
  baseurl = "https://rekt-files.herokuapp.com";
  res.send(baseurl + "/files/" + res.req.file.filename);
});

port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
