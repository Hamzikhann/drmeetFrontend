module.exports = {
	HOST: "localhost",
	USER: "root",
	PASSWORD: "",
	DB: "drmeet",
	dialect: "mysql",
	pool: {
		max: 8,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
};
