// !: Express
const express = require("express");
const app = express();
const UsersRoute = require("./Route/Users");

// !: MongDB
const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://catdbb1000:Q6AROqpJXeTWWVXi@cluster0.aud9pyi.mongodb.net/"
    )
    .then(() => console.log("connection success"))
    .catch((err) => console.error(err));

// !: BodyParser
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// !: API path way section
app.use("/users", UsersRoute);

app.listen(process.env.port || 2000);

module.exports = app;