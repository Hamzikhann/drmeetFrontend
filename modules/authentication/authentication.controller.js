const jwt = require("../../utils/jwt");
const Joi = require("@hapi/joi");
const emails = require("../../utils/emails");

const db = require("../../models");
const Users = db.users;
const Patient = db.patients;
const Doctor = db.doctors;

const login = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			Registeremail: Joi.string().max(255).required(),
			Registerpasswords: Joi.string().max(255).required()
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			const message = error.details[0].message.replace(/"/g, "");
			emails.errorEmail(req, error);

			res.status(400).send({
				message: message
			});
		} else {
			const { Registeremail, Registerpasswords } = req.body;

			const user = await Users.findOne({ where: { registerEmail: Registeremail, isActive: "Y" } });
			if (user) {
				if (user.registerPasswords != Registerpasswords) {
					res.status(401).json({ message: "The password is incorrect" });
				} else {
					let doctor;
					if (user.select == "Doctor") {
						doctor = await Doctor.findOne({ where: { docEmail: Registeremail } });
						if (doctor) {
							let doc = {
								id: doctor.id,
								name: doctor.name,
								email: doctor.docEmail
							};
							const accessToken = jwt.signToken(doc);
							res.json({
								doctor: doctor,
								message: "You have loged in successfully as a doctor",
								select: 1,
								accessToken: accessToken
							});
						}
					} else if (user.select == "Patient") {
						const patient = await Patient.findOne({ where: { patientEmail: Registeremail, isActive: "Y" } });
						if (patient) {
							let pat = {
								id: patient.id,
								name: patient.patientName,
								email: patient.patientEmail,
								age: patient.patientAge
							};
							let accessToken = jwt.signToken(pat);
							res.json({
								patient: patient,
								message: "You have loged in successfully as a Patient",
								select: 2,
								accessToken: accessToken
							});
						}
					}
				}
			} else {
				res.status(401).json({ message: "The provided mail is incorrect" });
			}
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

module.exports = { login };
