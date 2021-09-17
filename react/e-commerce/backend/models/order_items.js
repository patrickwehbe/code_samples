const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const Order_items = db.define(
	"order_items",
	{
		order_item_id: {
			autoIncrement: true,
			type: sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		order_item_quantity: {
			type: sequelize.INTEGER,
			allowNull: false,
		},
		order_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "orders",
				key: "order_id",
			},
		},
		product_id: {
			type: sequelize.DataTypes.UUID,
			allowNull: false,
			references: {
				model: "product",
				key: "product_id",
			},
		},
		product_size: {
			type: sequelize.STRING,
		},
		product_color: {
			type: sequelize.STRING,
		},
	},
	{
		sequelize,
		tableName: "order_items",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "order_item_id" }],
			},
			{
				name: "order_id",
				using: "BTREE",
				fields: [{ name: "order_id" }],
			},
			{
				name: "product_id",
				using: "BTREE",
				fields: [{ name: "product_id" }],
			},
		],
	}
);

// db.sync().then(() => {
// 	Order_items.sync({ force: true });
// });
module.exports = Order_items;
