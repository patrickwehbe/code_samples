const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
// 	try {
// 		const token = req.header("Authorization");
// 		if (!token)
// 			return res.status(401).json({ msg: "Invalid Authentication" });
// 		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
// 			if (err)
// 				return res.status(401).json({ msg: "Invalid Authentication" });
// 			req.user = user;
// 			next();
// 		});
// 	} catch (err) {
// 		res.status(500).json({ msg: err.message });
// 	}
// };
const auth = (req, res, next) => {
	try {
		const bearerHeader = req.headers["authorization"];
		const bearerToken = bearerHeader && bearerHeader.split(" ")[1];
		if (bearerToken == null)
			return res.status(401).json({ msg: "Invalid Authentication." });
		jwt.verify(
			bearerToken,
			process.env.ACCESS_TOKEN_SECRET,
			(err, user) => {
				if (err) return res.status(403).json({ msg: "forbidden" });
				req.user = user;
				next();
			}
		);
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};

module.exports = auth;
