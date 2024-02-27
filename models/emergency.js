// const mongoose = require("mongoose");

// const doctorschema = mongoose.Schema({
// 	did: Number,
// 	name: String,
// 	Speciality: String,
// 	City: String,
// 	Hospital: String,
// 	docemail: String,
// 	docphone: Number,
// 	docage: String,
// 	experience: String,
// 	bio: String,
// 	appointments: [
// 		{
// 			day: {
// 				type: String
// 			},
// 			time: {
// 				type: [String]
// 			}
// 		}
// 	]
// });

// module.exports = mongoose.model("Doctor", doctorschema);
"use strict";

module.exports = (sequelize, DataTypes) => {
	const emergency = sequelize.define(
		"emergency",
		{
			description: DataTypes.STRING,
			location: DataTypes.STRING,
			emergencyType: DataTypes.STRING,
			contactInfo: DataTypes.STRING,
			doctorSpeciality: DataTypes.STRING,
			city: DataTypes.STRING,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	emergency.associate = function (models) {};
	return emergency;
};
