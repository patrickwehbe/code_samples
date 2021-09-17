const Shop = require("../models/shop");

const shopControl = {
	getShop: async (req, res) => {
		try {
			const shops = await Shop.findAll();
			res.status(200).send(shops);
		} catch (err) {
			res.status(500).json({ msg: err.messsage });
		}
	},
	createShop: async (req, res) => {
		try {
			const { name, description, logo } = req.body;
			const shop = await Shop.findOne({ where: { shop_name: name } });
			if (shop)
				return res.status(400).json({ msg: "Shop already exists." });

			const newShop = await Shop.create({
				shop_name: name,
				shop_description: description,
				shop_logo: logo,
			});

			res.status(201).json({ msg: "New Shop created.", shop: newShop });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	deleteShop: async (req, res) => {
		try {
			await Shop.destroy({ where: { shop_id: req.params.id } });
			res.status(200).json({ msg: "Shop deleted successfully" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	updateShop: async (req, res) => {
		try {
			const { name, description, logo } = req.body;

			await Shop.update(
				{
					shop_name: name,
					shop_description: description,
					shop_logo: logo,
				},
				{ where: { shop_id: req.params.id } }
			);

			res.status(200).json({ msg: "Shop updated successfully." });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getShopById: async (req, res) => {
		try {
			const shop = await Shop.findOne({
				where: { shop_id: req.params.id },
			});
			res.status(200).json(shop);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = shopControl;
