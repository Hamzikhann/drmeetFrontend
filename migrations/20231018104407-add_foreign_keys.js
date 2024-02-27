"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("doctors", "userId", {
			type: Sequelize.INTEGER,
			references: {
				model: "users",
				key: "id"
			},
			allowNull: false
		});

		await queryInterface.addColumn("patients", "userId", {
			type: Sequelize.INTEGER,
			references: {
				model: "users",
				key: "id"
			},
			allowNull: false
		});

		await queryInterface.addColumn("appointments", "doctorId", {
			type: Sequelize.INTEGER,
			references: {
				model: "doctors",
				key: "id"
			},
			allowNull: true
		});

		await queryInterface.addColumn("appointments", "patientId", {
			type: Sequelize.INTEGER,
			references: {
				model: "patients",
				key: "id"
			},
			allowNull: true
		});
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.removeColumn("doctors", "userId");
		await queryInterface.removeColumn("patients", "userId");
		await queryInterface.removeColumn("appointments", "doctorId");
		await queryInterface.removeColumn("appointments", "patientId");
	}
};
