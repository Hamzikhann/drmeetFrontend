// const mongoose = require("mongoose");

// const patientschema = mongoose.Schema({
//   pid:Number,
//   pname:String,
//     page:Number,
//     pcity:String,
//     pbio:String,
//     pfone:Number,
//     pemail:String,
//     selectedhistory:Object
// });

// module.exports = mongoose.model("Patient", patientschema);
"use strict";

module.exports = (sequelize, DataTypes) => {
	const patients = sequelize.define(
		"patients",
		{
			patientName: DataTypes.STRING,
			patientAge: DataTypes.INTEGER,
			patientCity: DataTypes.STRING,
			patientBio: DataTypes.STRING,
			patientPhone: DataTypes.INTEGER,
			patientEmail: DataTypes.STRING,
			selectedHistory: DataTypes.TEXT,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	patients.associate = function (models) {
		patients.belongsTo(models.users);
	};
	return patients;
};
