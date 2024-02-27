const express = require("express");

const { getUsers, getAUser, createUser } = require("./user.controller");

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getAUser);

router.post("/post/user", createUser);

module.exports = router;
