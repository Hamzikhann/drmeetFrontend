const express = require("express");
const router = express.Router();
const jwt = require("../../utils/jwt");

const { create, list, updateEmergency } = require("./emergency.controller");

router.post("/create", create);

router.post("/list", jwt.protect, list);

router.post("/update", jwt.protect, updateEmergency);

module.exports = router;
