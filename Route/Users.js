const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// !: Schemas & Models
const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    key: String,
});
const UsersModel = mongoose.model("users", UsersSchema);

router.get("/", async(req, res, next) => {
    console.log("[Action | GET] - Check for server status");
    res.json("Server is running...");
});

router.get("/all", async(req, res, next) => {
    console.log("[Action | GET] - Get all users data");
    let users_data = await UsersModel.find();
    res.json(users_data);
});

router.get("/key", async(req, res, next) => {
    console.log("[Action | GET] - Get key", req.body);

    let CheckUsernameResult = await UsersModel.find({
        username: req.body.username,
    });
    // ?: Check username
    if (CheckUsernameResult.length > 0) { var CheckUsername = true; }
    else { var CheckUsername = false; }

    let CheckPasswordResult = await UsersModel.find({
        username: req.body.username,
        password: req.body.password,
    });
    // ?: Check password
    if (CheckPasswordResult.length > 0) { var CheckPassword = true; }
    else { var CheckPassword = false; }

    res.json([CheckUsername, CheckPassword, CheckPasswordResult[0].key]);
});

router.post("/", async(req, res, next) => {
    console.log("[Action | POST] - New register", req.body);

    let saving_data = {
        username: req.body.username,
        password: req.body.password,
        key: req.body.key,
    };

    let status = await UsersModel.create(saving_data);
    res.json(status);
});

module.exports = router;