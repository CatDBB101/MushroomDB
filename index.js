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

// !: Schemas & Models
const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    key: String,
});
const UsersModel = mongoose.model("users", UsersSchema);

const RecordsSchema = new mongoose.Schema({
    key: String,
    mode: String,
    records: [],
});
const RecordsModel = mongoose.model("records", RecordsSchema);

// !: API path way section
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
        res.send([CheckUsername, CheckPassword, CheckPasswordResult[0].key]);
    } else if (CheckUsername == true && CheckPassword == false) {
        res.send([CheckUsername, CheckPassword, "Password is incorrect"]);
    } else {
        res.send([CheckUsername, CheckPassword, "Not found username"]);
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

    let data = {
        key: req.body.key,
        records: [],
    };
    let _status = await RecordsModel.create(data);
    res.send(status);
});

app.post("/users/check/username", async (req, res, next) => {
    console.log("[Action | GET] - Check for the username used");

    let CheckUsernameResult = await UsersModel.find({
        username: req.body.username,
    });

    if (CheckUsernameResult.length == 0) {
        res.send(true);
    } else {
        res.send(false);
    }
});

app.post("/records", async (req, res, next) => {
    console.log("[Action | POST] - Create new record");

    console.log(req.body);
    var key = req.body.key;
    var time = req.body.time;
    var temp = req.body.temp;
    var humi = req.body.humi;
    var elec = req.body.elec;
    var fan = req.body.fan;

    var feedback = await RecordsModel.findOneAndUpdate(
        { key: key },
        { $push: { records: [time, temp, humi, elec, fan] } }
    );
    console.log(feedback);

    if (feedback === null) {
        res.send("KeyError");
    } else {
        res.send("Created");
    }
});

app.post("/records/get", async (req, res, next) => {
    console.log("[Action | POST] - Query data");

    var key = req.body.key;
    var Record = await RecordsModel.find({ key: key });
    console.log(Record);

    res.send(Record);
});

app.post("/records/reset", async (req, res, next) => {
    console.log("[Action | POST] - Have reset record");

    var key = req.body.key;
    RecordsModel.deleteOne({
        key: key,
    }).then(async () => {
        let data = {
            key: req.body.key,
            records: [],
        };
        let _status = await RecordsModel.create(data);
        res.send("Deleted");
    });
});

app.post("/get/name", async (req, res, next) => {
    console.log("[Action | POST] - Get the name by using key");

    var key = req.body.key;
    var name = await UsersModel.find({ key: key });

    if (name.length == 0) {
        res.send("Not found");
    } else {
        res.send(name[0].username);
    }
});

app.post("/users/delete", async (req, res, next) => {
    console.log("[Action | DELETE] - Delete account");

    var key = req.body.key;

    RecordsModel.deleteOne({
        key: key,
    }).then(async () => {});

    UsersModel.deleteOne({
        key: key,
    }).then(async () => {});

    res.send("Deleted");
});

app.listen(process.env.port || 2000);

module.exports = app;
