const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const queryInterface = db.getQueryInterface();
const Orders = db.define(
	"orders",
	{
		order_id: {
			autoIncrement: true,
			type: sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		order_status: {
			type: sequelize.STRING(100),
			defaultValue: "pending",
		},
		amount: {
			type: sequelize.INTEGER,
			defaultValue: 0,
		},
		order_eta: {
			type: sequelize.STRING,
			defaultValue: "",
		},
		user_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "user_id",
			},
		},
		address_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "address",
				key: "address_id",
			},
		},
		shop_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "shop",
				key: "shop_id",
			},
		},
	},
	{
		sequelize,
		tableName: "orders",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "order_id" }],
			},
			{
				name: "user_id",
				using: "BTREE",
				fields: [{ name: "user_id" }],
			},
			{
				name: "address_id",
				using: "BTREE",
				fields: [{ name: "address_id" }],
			},
			{
				name: "shop_id",
				using: "BTREE",
				fields: [{ name: "shop_id" }],
			},
		],
	}
);

// Drop table if the Schema changed

// db.sync().then(() => {
// 	Orders.sync({ force: true });
// });

//Edit Column

// queryInterface.changeColumn("product", "product_rating", {
// 	type: sequelize.FLOAT,
// 	allowNull: false,
// });
// queryInterface.changeColumn("orders", "order_eta", {
// 	type: sequelize.STRING,
// 	defaultValue: "",
// });

module.exports = Orders;
