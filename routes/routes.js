"use strict";
const jwt = require("../utils/jwt");

const authenticationRouteHandler = require("../modules/authentication/router");
const userRouterHandler = require("../modules/user/router");
const doctorRouterHandler = require("../modules/doctor/router");
const patientRouterHandler = require("../modules/patient/router");
const emergencyRouterHandler = require("../modules/emergency/router");

class Routes {
	constructor(app) {
		this.app = app;
	}
	appRoutes() {
		this.app.use("/api/auth", authenticationRouteHandler);
		this.app.use("/api/users", userRouterHandler);
		this.app.use("/api/doctor", doctorRouterHandler);
		this.app.use("/api/patient", patientRouterHandler);
		this.app.use("/api/emergency", emergencyRouterHandler);
	}
	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;
