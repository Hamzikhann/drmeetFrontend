// const mongoose = require("mongoose");

// const Appointmentschema = mongoose.Schema({
//   did: String,
//   name: String,
//   email: String,
//   sepciality: String,
//   hospital: String,
//   day: String,
//   time: Number,
//   pid: String,
// });

// module.exports = mongoose.model("Appointment", Appointmentschema);
"use strict";

module.exports = (sequelize, DataTypes) => {
	const appointments = sequelize.define(
		"appointments",
		{
			day: DataTypes.STRING,
			time: DataTypes.TEXT,
			place: DataTypes.STRING,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y" // Fixed the typo here, should be 'defaultValue'
			}
		},
		{ timestamps: true }
	);

	appointments.associate = function (models) {
		appointments.belongsTo(models.doctors); // Modified the foreignKey option
		appointments.belongsTo(models.patients); // Modified the foreignKey option
	};

	return appointments;
};
