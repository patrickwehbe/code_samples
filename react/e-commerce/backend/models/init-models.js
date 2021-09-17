var DataTypes = require("sequelize").DataTypes;
var _address = require("./address");
var _cart_item = require("./cart_item");
var _category = require("./category");
var _discount = require("./discount");
var _order_items = require("./order_items");
var _orders = require("./orders");
var _product = require("./product");
var _product_details = require("./product_details");
var _shop = require("./shop");
var _user = require("./user");

function initModels(sequelize) {
	var address = _address(sequelize, DataTypes);
	var cart_item = _cart_item(sequelize, DataTypes);
	var category = _category(sequelize, DataTypes);
	var discount = _discount(sequelize, DataTypes);
	var order_items = _order_items(sequelize, DataTypes);
	var orders = _orders(sequelize, DataTypes);
	var product = _product(sequelize, DataTypes);
	var product_details = _product_details(sequelize, DataTypes);
	var shop = _shop(sequelize, DataTypes);
	var user = _user(sequelize, DataTypes);

	address.belongsTo(user, { foreignKey: "user_id" });
	user.hasMany(address, { foreignKey: "user_id" });
	cart_item.belongsTo(user, { foreignKey: "user_id" });
	user.hasMany(cart_item, { foreignKey: "user_id" });
	cart_item.belongsTo(product_details, { foreignKey: "product_details_id" });
	product_details.hasMany(cart_item, { foreignKey: "product_details_id" });
	order_items.belongsTo(orders, { foreignKey: "order_id" });
	orders.hasMany(order_items, { foreignKey: "order_id" });
	order_items.belongsTo(product_details, {
		foreignKey: "product_details_id",
	});
	product_details.hasMany(order_items, { foreignKey: "product_details_id" });
	orders.belongsTo(user, { foreignKey: "user_id" });
	user.hasMany(orders, { foreignKey: "user_id" });
	orders.belongsTo(address, { foreignKey: "address_id" });
	address.hasMany(orders, { foreignKey: "address_id" });
	orders.belongsTo(discount, { foreignKey: "discount_id" });
	discount.hasMany(orders, { foreignKey: "discount_id" });
	product.belongsTo(category, { foreignKey: "category_id" });
	category.hasMany(product, { foreignKey: "category_id" });
	product.belongsTo(shop, { foreignKey: "shop_id" });
	shop.hasMany(product, { foreignKey: "shop_id" });
	product_details.belongsTo(product, { foreignKey: "product_id" });
	product.hasMany(product_details, { foreignKey: "product_id" });

	return {
		address,
		cart_item,
		category,
		discount,
		order_items,
		orders,
		product,
		product_details,
		shop,
		user,
	};
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
