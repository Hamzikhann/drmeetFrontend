const db = require("../../models");
const Joi = require("@hapi/joi");
const emails = require("../../utils/emails");

const { sequelize } = require("../../models");
const User = db.users;
const Doctor = db.doctors;
const Patient = db.patients;

const createUser = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			Fullname: Joi.string().max(255).required(),
			Registerpasswords: Joi.string().max(255).required(),
			select: Joi.string().max(255).required(),
			phone: Joi.string().max(255).required(),
			Registeremail: Joi.string().max(255).required(),

			doctor: Joi.object({
				name: Joi.string().allow("").allow(null),
				docemail: Joi.string().allow("").allow(null),
				docphone: Joi.string().max(255).allow("").allow(null),

				Speciality: Joi.string().max(255),
				City: Joi.string().max(255).optional(),
				Hospital: Joi.string().max(255).optional(),
				docage: Joi.any().optional(),
				experience: Joi.any().optional(),
				bio: Joi.string().max(255).optional()
			}).optional(),
			patient: Joi.object({
				pname: Joi.string().optional().allow("").allow(null),
				pfone: Joi.string().optional().allow("").allow(null),
				pemail: Joi.string().optional().allow("").allow(null),
				page: Joi.any().optional(),
				pcity: Joi.string().max(255).optional(),
				selectedhistory: Joi.any().optional(),
				pbio: Joi.string().max(255).optional()
			}).optional()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);
			res.status(400).send({
				message: message
			});
		} else {
			const userObj = {
				fullName: req.body.Fullname,
				registerPasswords: req.body.Registerpasswords,
				select: req.body.select,
				phone: req.body.phone,
				registerEmail: req.body.Registeremail
			};

			let transaction = await sequelize.transaction();

			User.create(userObj, { transaction })
				.then(async (response) => {
					if (response.select == "Doctor") {
						const doctorObj = {
							name: response.fullName,
							speciality: req.body.doctor.Speciality,
							city: req.body.doctor.City,
							hospital: req.body.doctor.Hospital,
							docEmail: response.registerEmail,
							doctorPhone: response.phone,
							doctorAge: req.body.doctor.docage,
							experience: req.body.doctor.experience,
							doctorBio: req.body.doctor.bio,
							userId: response.id
						};
						const newdoc = await Doctor.create(doctorObj, { transaction });

						await transaction.commit();
						res.json({ newuser: response, message: "the user is created" });
					} else if (response.select == "Patient") {
						const patientObj = {
							patientName: response.fullName,
							patientAge: req.body.patient.page,
							patientCity: req.body.patient.pcity,
							patientBio: req.body.patient.pbio,
							patientPhone: response.phone,
							patientEmail: response.registerEmail,
							selectedHistory: JSON.stringify(req.body.patient.selectedhistory),
							userId: response.id
						};

						const newpatient = await Patient.create(patientObj, {
							transaction
						});

						await transaction.commit();
						res.json({ newuser: response, message: "the user is created" });
					}
				})
				.catch(async (err) => {
					if (transaction) await transaction.rollback();
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

const getUsers = async (req, res) => {
	try {
		User.findAll({ where: { isActive: "Y" } })
			.then((response) => {
				res.json({ message: "All users are retrived", data: response });
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

const getAUser = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			id: Joi.any().required()
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

			const user = User.findOne({ where: { id: id } });

			res.json({ user: user, message: "The user of the given id" });
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

module.exports = { getUsers, createUser, getAUser };
