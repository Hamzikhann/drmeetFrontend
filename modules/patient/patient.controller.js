const db = require("../../models");
const Joi = require("@hapi/joi");
const emails = require("../../utils/emails");

const Patient = db.patients;
const Appointment = db.appointments;
const User = db.users;
const Doctor = db.doctors;

const createPatient = async (req, res) => {
	const { pname, page, pcity, pbio, pfone, pemail, selectedhistory } = req.body;

	const user = await User.findOne({ where: { registerEmail: pemail } });

	if (user) {
		const newpat = await Patient.create({
			patientName: pname,
			patientAge: page,
			patientCity: pcity,
			patientBio: pbio,
			patientPhone: pfone,
			patientEmail: pemail,
			selectedHistory: JSON.stringify(selectedhistory),
			userId: user.id
		});
		res.json({ newpat: newpat });
	} else {
		res.status(400).send({ message: "this user does not exist" });
	}
};

const getPatients = async (req, res) => {
	try {
		Patient.findAll({ where: { isActive: "Y" } })
			.then((response) => {
				res.json({ patient: response });
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message || "Some error occurred."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

const getAptient = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			id: Joi.string().max(255).required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const patient = await Patient.findOne({ where: { id: req.body.id } });

			if (patient) {
				let appoint = await Appointment.findAll({
					where: { patientId: req.body.id, isActive: "Y" },
					include: [
						{
							model: Doctor,
							where: { isActive: "Y" }
						}
					]
				});

				if (appoint) {
					res.json({ message: "patient founded", patient: patient, appointment: appoint });
				} else {
					res.json({ message: "patient founded this patient has no appointments", patient: patient });
				}
			} else {
				res.status(500).send({
					message: err.message || "Some error occurred."
				});
			}
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

const createPatientAppointment = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			day: Joi.string().max(255).required(),
			slots: Joi.any().required(),
			doctorId: Joi.any().required(),
			patientId: Joi.any().required(),
			place: Joi.string().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const appointmentObj = {
				day: req.body.day,
				time: req.body.slots,
				doctorId: req.body.doctorId,
				patientId: JSON.parse(req.body.patientId),
				place: req.body.place
			};
			Patient.findOne({ where: { id: req.body.patientId, isActive: "Y" } })
				.then((response) => {
					if (response) {
						Appointment.findOne({
							where: {
								day: req.body.day,
								time: req.body.slots,
								doctorId: req.body.doctorId,
								patientId: JSON.parse(req.body.patientId),
								place: req.body.place
							}
						})
							.then((response) => {
								if (response) {
									res.json({ message: "this appointment is already created" });
								} else {
									Appointment.create(appointmentObj)
										.then((response) => {
											res.json({ message: "appoint is created", appointment: response });
										})
										.catch((err) => {
											res.status(500).send({
												message: err.message || "Some error occurred."
											});
										});
								}
							})
							.catch((err) => {
								res.status(500).send({
									message: err.message || "Some error occurred."
								});
							});
					}
				})
				.catch((err) => {
					res.status(500).send({
						message: err || "Some error occurred."
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

const deleteAppointment = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			appointmentId: Joi.any().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const appointmentId = req.body.appointmentId;
			await Appointment.update({ isActive: "N" }, { where: { id: appointmentId } })
				.then((response) => {
					res.json({ message: "The appointment is removed from the list" });
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message
		});
	}
};

module.exports = { createPatient, getPatients, getAptient, createPatientAppointment, deleteAppointment };
