const db = require("../../models");
const Joi = require("@hapi/joi");
const emails = require("../../utils/emails");

const Doctors = db.doctors;
const User = db.users;
const Appointment = db.appointments;
const Patient = db.patients;

const addDoctor = async (req, res) => {
	try {
		let user = await User.findOne({ where: { registerEmail: docemail } });

		const { name, Speciality, City, Hospital, docemail, docphone, docage, experience, bio, appointments } = req.body;
		let doctor = await Doctors.findOne({ where: { docEmail: docemail } });

		if (doctor) {
			res.json({
				message: "There is already an account with this email please use another email for REGISTRATION"
			});
		} else {
			let id = user.id;
			let doc = {
				name,
				speciality: Speciality,
				city: City,
				hospital: Hospital,
				docEmail: docemail,
				doctorPhone: docphone,
				doctorAge: docage,
				experience: experience,
				doctorBio: bio,
				userId: id
			};
			const newdoc = await Doctors.create(doc);
			res.json({
				message: "Your account is being created SusscessFully",
				newdoc
			});
		}
	} catch (err) {
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

const getDoctors = async (req, res) => {
	try {
		Doctors.findAll({ where: { isActive: "Y" } })
			.then((response) => {
				res.json(response);
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

const updateAppointment = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			appointments: Joi.any().required(),
			email: Joi.string().max(255).optional(),
			id: Joi.string().optional()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const appointments = req.body.appointments;
			var whereClause;
			if (req.body.email) {
				whereClause = { docEmail: req.body.email, isActive: "Y" };
			} else {
				whereClause = { id: req.body.id, isActive: "Y" };
			}
			Doctors.findOne({ where: whereClause })
				.then((response) => {
					if (response) {
						Doctors.update({ appointments: JSON.stringify(appointments) }, { where: whereClause })
							.then((response) => {
								res.json({
									updatedDoctor: response,
									message: "The appointments are updated"
								});
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
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

const doctorAppointments = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			id: Joi.any().optional()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const { id } = req.params;
			Appointment.findAll({
				where: { doctorId: id, isActive: "Y" },
				include: [
					{
						model: Patient,
						where: { isActive: "Y" }
					}
				]
			})
				.then((response) => {
					res.status(200).json({ message: "Doctor appointments with patients retrived", data: response });
				})
				.catch((err) => {
					res.status(500).send({
						message: err.message || "Some error occurred."
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

const getAdoctor = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			doctorid: Joi.any().required()
		});

		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const doctorid = req.body.doctorid;

			if (!doctorid) {
				res.json({ message: "The id is not defined" });
			}

			let doctor = await Doctors.findOne({ where: { id: doctorid } });

			if (doctor) {
				res.json({ message: "Doctor founded", doctor: doctor });
			} else {
				res.json({ message: "We can not find you Please Refreash or Login Again" });
			}
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

const searchedDoctor = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			ids: Joi.any().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const ids = req.body.ids;
			if (ids.length <= 0) {
				Doctors.findAll({ where: { isActive: "Y" } })
					.then((response) => {
						res.send({
							message: "Doctors of desired search are not found soo here are all the doctors",
							data: response
						});
					})
					.catch((err) => {
						res.status(500).send({
							message: err.message || "Some error occurred."
						});
					});
			} else {
				Doctors.findAll({ where: { id: ids, isActive: "Y" } })
					.then((response) => {
						res.send({ message: "Doctors of the desired search", data: response });
					})
					.catch((err) => {
						res.status(500).send({
							message: err.message || "Some error occurred."
						});
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

module.exports = {
	addDoctor,
	getDoctors,
	updateAppointment,
	doctorAppointments,
	getAdoctor,
	searchedDoctor
};
