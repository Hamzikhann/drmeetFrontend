const db = require("../../models");
const { sequelize } = require("../../models");
const Joi = require("@hapi/joi");
const emails = require("../../utils/emails");

const Op = db.Sequelize.Op;

const Emergency = db.emergency;
const Doctor = db.doctors;
const EmergencyAppointment = db.emergencyAppointments;

const create = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			description: Joi.string().optional(),
			locationName: Joi.string().required(),
			emergencyType: Joi.string().required(),
			contactInfo: Joi.string().required(),
			doctorSpeciality: Joi.string().required(),
			city: Joi.string().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const emergencyObj = {
				description: req.body.description ? req.body.description : null,
				location: req.body.locationName,
				emergencyType: req.body.emergencyType,
				contactInfo: req.body.contactInfo,
				doctorSpeciality: req.body.doctorSpeciality,
				city: req.body.city
			};

			Emergency.findOne({
				where: {
					location: req.body.locationName,
					emergencyType: req.body.emergencyType,
					contactInfo: req.body.contactInfo,
					doctorSpeciality: req.body.doctorSpeciality,
					city: req.body.city,
					isActive: "Y"
				}
			})
				.then(async (respon) => {
					if (respon) {
						res.json({ message: "this emergency is already in process" });
					} else {
						let transaction = await sequelize.transaction();
						Emergency.create(emergencyObj, { transaction })
							.then(async (response) => {
								Doctor.findAll({
									where: {
										city: response.city,
										speciality: response.doctorSpeciality,
										isActive: "Y"
									}
								})
									.then(async (respons) => {
										const emergencyAppointmentobj = [];
										const emailsList = [];
										respons.forEach((e) => {
											let obj = {
												emergencyId: response.id,
												doctorId: e.id
											};
											let email = {
												email: e.docEmail
											};
											emailsList.push(email);
											emergencyAppointmentobj.push(obj);
										});

										const appointment = await EmergencyAppointment.bulkCreate(emergencyAppointmentobj, { transaction });
										emails.assignEmergency(emailsList, emergencyObj);
										await transaction.commit();

										res.json({
											message: "the emergency is created",
											data: response
										});
									})
									.catch(async (err) => {
										if (transaction) await transaction.rollback();

										res.status(500).send({
											message: err.message || "Some error occurred."
										});
									});
							})
							.catch(async (err) => {
								if (transaction) await transaction.rollback();
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

const list = (req, res) => {
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
			EmergencyAppointment.findAll({
				where: { doctorId: req.body.id, isActive: "Y", active: "A" },
				include: [
					{
						model: Emergency,
						where: { isActive: "Y" }
					}
				]
			})
				.then((response) => {
					if (response.length != 0) {
						res.json({
							message: "the emergency appointments are all retrived for the doctor",
							data: response
						});
					} else {
						res.json({
							message: "There is no emergency at this time",
							data: []
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

const updateEmergency = (req, res) => {
	try {
		const joiSchema = Joi.object({
			emergencyAppointmentId: Joi.any().required(),
			emergencyId: Joi.any().required(),
			doctorId: Joi.any().required(),
			flag: Joi.any().required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const emergencyAppointmentId = req.body.emergencyAppointmentId;
			const emergencyId = req.body.emergencyId;
			const doctorId = req.body.doctorId;
			const updateObj = { active: "N", isActive: "N" };
			const flag = req.body.flag;
			let whereClause;
			if (flag == 1) {
				whereClause = {
					isActive: "Y",
					active: "A",
					doctorId: doctorId,
					id: emergencyAppointmentId
				};
			} else {
				whereClause = {
					[Op.not]: {
						doctorId: doctorId
					},
					emergencyId: emergencyId
				};
			}
			EmergencyAppointment.update(updateObj, {
				where: whereClause
			})
				.then((response) => {
					res.json({ message: "Emergency appointed to you" });
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

module.exports = { create, list, updateEmergency };
