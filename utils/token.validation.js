const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
	let token;
	let authHead = req.headers.Authorization || req.headers.authorization;
	if (authHead && authHead.startsWith("Bearer")) {
		token = authHead.split(" ")[1];
		jwt.verify(token, "123456789", (err, decoded) => {
			if (err) {
				res.status(401).json({ message: "There is ssome roblem with the token" });
			}
			req.user = decoded.user;
			next();
		});
		if (!token) {
			res.json({ message: "the token is missing" }).status(401);
		}
	}
};

module.exports = validateToken;
