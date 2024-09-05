const { log } = require("console");
const express = require("express");
const { logger } = require("./middleware/logEvents.js");
const errorHandler = require("./middleware/errorHandler.js");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

//Custom Middle Ware
app.use(logger);

//Thired party Middele Ware
//app.use(cors());

//cors Origin Resource Sharing specific URL
const whitelist = [
  "https:google.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin !== -1) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//Build in Middle Wares
//1.To get Form data
app.use(express.urlencoded({ extended: false }));
//2.To get json data
app.use(express.json());
//3.To get public floder access
app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/subdir", express.static(path.join(__dirname, "./public")));

//Routing
app.use("/", require("./routes/root.js"));
app.use("/subdir", require("./routes/subdir.js"));

app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("Hellow.html File Engada?");
    next();
  },
  (req, res) => {
    res.send("Hello Makkaly");
  }
);

const one = (req, res, next) => {
  console.log("One");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("Three");
  res.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server Running On ${PORT}`));
