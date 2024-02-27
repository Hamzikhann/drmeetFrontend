const http = require("http");
const express = require("express");

const appConfig = require("./config/app");
const routes = require("./routes/routes");
const db = require("./models/index");

class Server {
	constructor() {
		this.app = express();
		db.sequelize
			.sync()
			.then(() => {
				console.log("Synced db.....................");
			})
			.catch((err) => {
				console.log("Failed to sync db: " + err);
			});

		/**
		 * Create Mysql Connection
		 * console.log('MySQL connected successfully.');
		 */
	}

	appConfig() {
		new appConfig(this.app).includeConfig();
	}

	includeRoute() {
		new routes(this.app).routesConfig();
	}

	async appExecute() {
		const port = process.env.PORT || 5002;

		this.appConfig();
		this.includeRoute();

		var server = http.createServer(this.app);
		server.listen(port, (req, res) => {
			console.log(`app is listening to this ${port}`);
		});
	}
}

const app = new Server();
app.appExecute();
