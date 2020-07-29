const express = require("express");
const app = express();
const Randomstring = require("randomstring");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
var fs = require("fs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
    },
  } /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});
const router = express.Router();
const Files = sequelize.define("Files", {
  fileid: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique:true,
    allowNull: false,
  },
  filelink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

let rend;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: async function (req, file, cb) {
    name = file.originalname.split(".");
    rend = Randomstring.generate(7);
    fs.mkdirSync("./files/" + rend);
    const feel = await Files.create({
      fileid: rend,
      filelink:
        "https://rekt-files.herokuapp.com/" +
        rend +
        "/" +
        file.originalname,
    });
    cb(null, rend + "/" + file.originalname);
  },
});
var uploads = multer({ storage: storage });
app.use(express.static("files"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.post("/upload", uploads.single("file"), function (req, res) {
  baseurl = "https://rekt-files.herokuapp.com/";
  res.send(encodeURI(baseurl + "dl/" + rend));
});
app.get("/dl/:id", async (req, res) => {
  id = req.params.id;
  file = await Files.findByPk(id)
    .then((data) => {
      res.redirect(data.filelink);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Not found");
    });
});
var uploads = multer({ storage: storage });
app.use(express.static("files"));
app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.get("/upload", (req, res) =>
  res.sendFile(path.join(__dirname + "/index.html"))
);
port = process.env.PORT || 8080;
Files.sync({ force: true });
app.use("/", router);
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
function get_url_extension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}
