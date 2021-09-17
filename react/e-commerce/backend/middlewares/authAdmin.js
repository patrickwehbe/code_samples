const Users = require("../models/user");

const authAdmin = async (req, res, next) => {
	try {
		if (req.user.role !== 2) {
			return res
				.status(403)
				.json({ msg: "Admin ressources access denied." });
		}
		next();
	} catch (error) {
		return res.status(500).json({ msg: err.message });
	}
};

module.exports = authAdmin;
