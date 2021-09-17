const Address = require("../models/address");
const User = require("../models/user");
const Shop = require("../models/shop");
const Order = require("../models/orders");

const addressControl = {
	createAddress: async (req, res) => {
		try {
			const { address1, address2, postcode, city, user_id } = req.body;
			const newAddress = await Address.create({
				address1: address1,
				address2: address2,
				postcode: postcode,
				city: city,
				user_id: user_id,
			});
			res.status(201).json(newAddress);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAddressByUser: async (req, res) => {
		try {
			const user = await User.findOne({
				where: { user_id: req.query.user_id },
			});
			if (user) {
				const address = await Address.findAll({
					where: {
						user_id: req.query.user_id,
					},
				});
				res.status(200).json({ address });
			} else {
				res.status(300).json({ msg: "user not found" });
			}
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getAddressByShop: async (req, res) => {
		try {
			const shop = await Shop.findOne({
				where: { shop_id: req.query.shop_id },
			});
			const address = await Address.findAll({
				where: { shop_id: req.query.shop_id },
			});
			res.status(200).json(address);
		} catch (error) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteAddress: async (req, res) => {
		try {
			await Address.destroy({ where: { address_id: req.params.id } });
			res.status(200).json({ msg: "deleted" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	updateAddress: async (req, res) => {
		try {
			const { address1, address2, postcode, city } = req.body;
			const address = await Address.findOne({
				where: { user_id: req.params.id },
			});
			await address.update({
				address1: address1,
				address2: address2,
				postcode: postcode,
				city: city,
			});
			res.status(200).json({ msg: "address updated" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAllAddress: async (req, res) => {
		try {
			const allAdress = await Address.findAll({});
			res.status(200).json(allAdress);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getAddressById: async (req, res) => {
		try {
			const address = await Address.findOne({
				where: { address_id: req.params.id },
			});
			res.json(address);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
};
module.exports = addressControl;
