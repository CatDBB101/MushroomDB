// !: Express
const express = require("express");
const app = express();
const UsersRoute = require("./Route/Users");

// !: MongDB
const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://catdbb1000:Q6AROqpJXeTWWVXi@cluster0.aud9pyi.mongodb.net/?retryWrites=true&w=majority"
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

app.get("/", (req, res) => {
    console.log("[Action | Get] Check server status");
    res.send("Server is running...");
});

app.listen(process.env.port || 2000);

module.exports = app;