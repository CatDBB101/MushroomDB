// !: Express
const express = require("express");
const app = express();
// const UsersRoute = require("./Route/Users");

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

// !: CookieParser
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // initializing the lib

// !: API path way section
// app.use("/users", UsersRoute);

// !: Schemas & Models
const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    key: String,
});
const UsersModel = mongoose.model("users", UsersSchema);

app.get("/", async (req, res, next) => {
    console.log("[Action | GET] - Check for server status");
    res.send("Server is running...");
});

app.get("/users/all", async (req, res, next) => {
    console.log("[Action | GET] - Get all users data");
    let users_data = await UsersModel.find();
    res.send(users_data);
});

app.post("/users/key", async (req, res, next) => {
    console.log("[Action | GET] - Get key", req.body);

    let CheckUsernameResult = await UsersModel.find({
        username: req.body.username,
    });
    // ?: Check username
    if (CheckUsernameResult.length > 0) {
        var CheckUsername = true;
    } else {
        var CheckUsername = false;
    }

    let CheckPasswordResult = await UsersModel.find({
        username: req.body.username,
        password: req.body.password,
    });
    // ?: Check password
    if (CheckPasswordResult.length > 0) {
        var CheckPassword = true;
    } else {
        var CheckPassword = false;
    }

    if (CheckUsername == true && CheckPassword == true) {
        res.cookie("MushroomLoginKey", CheckPasswordResult[0].key);
        res.send([CheckUsername, CheckPassword, CheckPasswordResult[0].key, req.body.username, req.body.password]);
    } else if (CheckUsername == true && CheckPassword == false) {
        res.send([CheckUsername, CheckPassword, "Password is incorrect", req.body.username, req.body.password]);
    } else {
        // res.send(req);
        res.send([CheckUsername, CheckPassword, "Not found username", req.body.username, req.body.password]);
    }
});

app.post("/users/", async (req, res, next) => {
    console.log("[Action | POST] - New register", req.body);

    let saving_data = {
        username: req.body.username,
        password: req.body.password,
        key: req.body.key,
    };

    let status = await UsersModel.create(saving_data);
    res.send(status);
});

app.listen(process.env.port || 2000);

module.exports = app;
