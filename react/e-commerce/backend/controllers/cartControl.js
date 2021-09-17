const Cart = require("../models/cart");
const CartItem = require("../models/cart_item");
const Product = require("../models/product");

const cartControl = {
	getCartInfo: async (req, res) => {
		try {
			const cart = await Cart.findOne({
				where: {
					cart_id: req.body.cart_id,
				},
			});

			const cartItems = await CartItem.findAll({
				where: { cart_id: cart.cart_id },
			});
			var total_quantity = 0;
			var total_price = 0;
			const products = [];
			var product_price = [];
			const cart_products = [];

			cartItems.forEach(
				(item) => (
					(total_quantity += item.quantity), products.push(item)
				)
			);
			res.json(products);

			// res.status(200).json({
			// 	products: items,
			// 	total_quantity: total_quantity,
			// 	total_price: total_price,
			// });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	addCart: async (req, res) => {
		try {
			const cartItem = await CartItem.create({
				cart_id: req.body.cart_id,
				product_id: req.body.product_id,
				quantity: req.body.quantity,
				product_size: req.body.size,
				product_color: req.body.color,
			});
			res.json(cartItem);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getCartId: async (req, res) => {
		try {
			const cartId = await Cart.findOrCreate({
				where: { user_id: req.body.user_id },
			});
			res.json({ cartId });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	removeCartItem: async (req, res) => {
		try {
			await CartItem.destroy({
				where: {
					cart_item_id: req.body.cart_item_id,
				},
			});
			res.json({ msg: "deleted successfully" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	allCarts: async (req, res) => {
		try {
			const carts = await Cart.findAll();
			res.json(carts);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	editCart: async (req, res) => {
		try {
			await CartItem.update(
				{ quantity: req.body.quantity },
				{
					where: {
						cart_item_id: req.body.cart_item_id,
					},
				}
			);
			res.json({ msg: "updated" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getProducts: async (req, res) => {
		try {
			const products = [];

			const cart = await Cart.findOne({
				where: {
					cart_id: req.body.cart_id,
				},
			});

			await CartItem.findAll({
				where: { cart_id: cart.cart_id },
			})

				.then(function (cartItem) {
					promises = [];

					cartItem.map((i) => {
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
	emptyCart: async (req, res) => {
		try {
			const products = [];

			await CartItem.findAll({
				where: { cart_id: req.params.id },
			})

				.then(function (cartItem) {
					promises = [];

					cartItem.map((i) => {
						promises.push(
							CartItem.destroy({
								where: { cart_item_id: i.cart_item_id },
							})
						);
					});

					return Promise.all(promises);
				})
				.then(function () {
					res.json("cart empty");
				});
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = cartControl;
