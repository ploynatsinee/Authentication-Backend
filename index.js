const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "bkojijlhijijjijll",
    saveUninitialized: true,
    cookie: { secure: true, maxAge: oneDay },
    resave: false,
  })
);

app.use(async (req, res, next) => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Database is connected");
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

app.get("/", (req, res) => {
  try {
    res.cookie("name", "value=true", {
      expire: 360000 + Date.now(),
      httpOnly: true,
      signed: false,
    });
    res.send(req.cookies);
    console.log("req Cookies: ", req.cookies);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

//User
const userRoutes = require("./routers/userRoute");
app.use("/users", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});
