const Users = require("../models/user");

const authShopOwner = async (req, res, next) => {
	try {
		const user = await Users.findOne({
			where: { id: req.user.user_id },
		});
		if (user.role !== 1 || user.role !== 2) {
			return res.status(403).send("shop owner ressources access denied.");
		}
		next();
	} catch (error) {
		return res.status(500).json({ msg: err.message });
	}
};

module.exports = authShopOwner;
