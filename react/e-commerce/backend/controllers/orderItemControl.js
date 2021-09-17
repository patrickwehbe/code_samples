const Order = require("../models/orders");
const User = require("../models/user");
const Product = require("../models/product");
const OrderItems = require("../models/order_items");

const orderItemControl = {
	getOrderItems: async (req, res) => {
		try {
			const products = [];

			const order = await Order.findOne({
				where: {
					order_id: req.query.order_id,
				},
			});

			await OrderItems.findAll({
				where: { order_id: order.order_id },
			})

				.then(function (orderItems) {
					promises = [];

					orderItems.map((i) => {
						promises.push(
							Product.findOne({
								where: { product_id: i.product_id },
							}).then((product) => {
								for (p in product) {
									products[p] = product;

									return products[p];
								}
							})
						);
					});

					return Promise.all(promises);
				})
				.then(function (product) {
					res.json(product);
				});
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	createOrderItem: async (req, res) => {
		try {
			const {
				order_item_quantity,
				order_id,
				product_id,
				size,
				color,
			} = req.body;
			const newItem = await OrderItems.create({
				order_item_quantity: order_item_quantity,
				order_id: order_id,
				product_id: product_id,
				product_size: size,
				product_color: color,
			});

			const order = await Order.findOne({
				where: { order_id: order_id },
			});
			const total = order.amount;

			await Order.update(
				{
					amount: req.body.order_item_quantity + total,
				},
				{ where: { order_id: order_id } }
			);

			res.status(201).json({ msg: "Item added successfully" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	deleteOrderItem: async (req, res) => {
		try {
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getOrderItemsInformation: async (req, res) => {
		try {
			const orderItems = await OrderItems.findAll({
				where: {
					order_id: req.query.order_id,
				},
			});
			res.json(orderItems);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = orderItemControl;
