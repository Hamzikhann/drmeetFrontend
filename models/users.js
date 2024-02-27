// const mongoose = require("mongoose");

// const {sequelize}=require(".");

// const userschema = mongoose.Schema({
//     Fullname:String,
//     Registerpasswords:String,
//     Registeremail:String,
//     select:String,
//     phone:Number
// });

// module.exports = mongoose.model("User", userschema);
"use strict";
module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define(
		"users",
		{
			fullName: DataTypes.STRING,
			registerPasswords: DataTypes.STRING,
			registerEmail: DataTypes.STRING,
			select: DataTypes.STRING,
			phone: DataTypes.INTEGER,
			isActive: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Y"
			}
		},
		{ timestamps: true }
	);
	users.associate = function (models) {};
	return users;
};
