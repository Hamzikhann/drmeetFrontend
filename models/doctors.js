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
	const doctors = sequelize.define(
		"doctors",
		{
			name: DataTypes.STRING,
			speciality: DataTypes.STRING,
			city: DataTypes.STRING,
			hospital: DataTypes.STRING,
			docEmail: DataTypes.STRING,
			doctorAge: DataTypes.INTEGER,
			doctorPhone: DataTypes.INTEGER,
			doctorBio: DataTypes.STRING,
			experience: DataTypes.STRING,
			appointments: { type: DataTypes.TEXT, allowNull: true },
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	doctors.associate = function (models) {
		doctors.belongsTo(models.users);
	};
	return doctors;
};
