const Order = require("../models/orders");
const User = require("../models/user");
const Shop = require("../models/shop");
const Order_item = require("../models/order_items");

const orderControl = {
	getOrdersByUser: async (req, res) => {
		try {
			const user = await User.findOne({
				where: { user_id: req.query.user_id },
			});

			const order = await Order.findAll({
				where: {
					user_id: req.query.user_id,
				},
			});

			res.status(200).json(order);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getOrdersByShop: async (req, res) => {
		try {
			const usernames = {};
			const orders = [];

			await Order.findAll({
				where: {
					shop_id: req.query.shop_id,
				},
			})

				.then(function (order) {
					promises = [];

					order.map((order) => {
						orders.push(order);
						promises.push(
							User.findOne({
								where: { user_id: order.user_id },
							}).then((users) => {
								for (user in users) {
									usernames[user] = users.user_username;

									return usernames[user];
								}
							})
						);
					});

					return Promise.all(promises);
				})
				.then(function (usernames) {
					res.json({ usernames: usernames, orders: orders });
				});
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	createOrder: async (req, res) => {
		try {
			const {
				order_status,
				amount,
				user_id,
				address_id,
				shop_id,
			} = req.body;

			const newOrder = await Order.create({
				amount: amount,
				user_id: user_id,
				address_id: address_id,
				shop_id: shop_id,
			});

			res.status(201).json(newOrder);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	updateOrder: async (req, res) => {
		try {
			const { order_status, order_eta } = req.body;
			const newOrder = await Order.update(
				{
					order_status: order_status,
					order_eta: order_eta,
				},
				{ where: { order_id: req.params.id } }
			);
			res.status(200).json({ msg: "order updated" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	deleteOrder: async (req, res) => {
		try {
			const orderItems = await Order_item.findAll({
				where: { order_id: req.params.id },
			});
			orderItems.forEach(async (item) => {
				await Order_item.destroy({
					where: { order_item_id: item.order_item_id },
				});
			});

			await Order.destroy({ where: { order_id: req.params.id } });
			res.status(200).json({ msg: "order deleted" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getAllOrder: async (req, res) => {
		try {
			const allOrders = await Order.findAll({});
			res.status(200).json(allOrders);
		} catch (error) {
			res.status(500).json({ msg: error.message });
		}
	},
};

module.exports = orderControl;
