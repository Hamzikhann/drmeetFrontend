const express = require("express");
const router = express.Router();
const jwt = require("../../utils/jwt");

const {
  addDoctor,
  getDoctors,
  updateAppointment,
  doctorAppointments,
  getAdoctor,
  searchedDoctor,
} = require("./doctor.controller");

router.get("/", getDoctors);

// router.post("/post/doctor", addDoctor);

router.put("/update", updateAppointment);

router.post("/find/:id", jwt.protect, doctorAppointments);

router.post("/detail", getAdoctor);

router.post("/list", searchedDoctor);

module.exports = router;
