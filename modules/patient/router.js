const express = require("express");
const router = express.Router();

const jwt = require("../../utils/jwt");

const {
	getPatients,
	createPatient,
	getAptient,
	createPatientAppointment,
	deleteAppointment
} = require("./patient.controller");

router.get("/", getPatients);

// router.post("/create", createPatient);

router.post("/detail", getAptient);

router.post("/create/appointment", jwt.protect, createPatientAppointment);

router.post("/delete/appointment", jwt.protect, deleteAppointment);

module.exports = router;
