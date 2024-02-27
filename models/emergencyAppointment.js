"use strict";

module.exports = (sequelize, DataTypes) => {
	const emergencyAppointments = sequelize.define(
		"emergencyAppointments",
		{
			active: {
				type: DataTypes.STRING,
				defaultValue: "A",
				allowNull: false
			},
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y" // Fixed the typo here, should be 'defaultValue'
			}
		},
		{ timestamps: true }
	);

	emergencyAppointments.associate = function (models) {
		emergencyAppointments.belongsTo(models.doctors); // Modified the foreignKey option
		emergencyAppointments.belongsTo(models.emergency); // Modified the foreignKey option
	};

	return emergencyAppointments;
};
