const sequelize = require("sequelize");
const db = require("../Database/dbConnection");

const Cart = db.define(
	"cart",
	{
		cart_id: {
			type: sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "user_id",
			},
		},
	},
	{
		sequelize,
		tableName: "cart",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "cart_id" }],
			},
			{
				name: "user_id",
				using: "BTREE",
				fields: [{ name: "user_id" }],
			},
		],
	}
);

// Drop table if the Schema changed

// db.sync().then(() => {
// 	Cart.sync({ force: true });
// });

module.exports = Cart;
