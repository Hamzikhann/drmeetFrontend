const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		const connect = await mongoose.connect(process.env.CONNECTIONSTRING);
		console.log("DB is cononect", connect.connection.host, connect.connection.name);
	} catch (err) {
		console.log({ message: err });
		process.exit(1);
	}
};

module.exports = connectDb;
