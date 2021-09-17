const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const Product = require("./product");
const CartItem = db.define(
	"cart_item",
	{
		cart_item_id: {
			type: sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		cart_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "cart",
				key: "cart_id",
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
		quantity: {
			type: sequelize.INTEGER,
			allowNull: false,
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
		tableName: "cart_item",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "cart_item_id" }],
			},
			{
				name: "cart_id",
				using: "BTREE",
				fields: [{ name: "cart_id" }],
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
// 	CartItem.sync({ force: true });
// });

module.exports = CartItem;
