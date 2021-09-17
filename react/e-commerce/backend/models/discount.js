const Sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const Discount = db.define(
	"discount",
	{
		discount_id: {
			autoIncrement: true,
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		discount_name: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		discount_value: {
			type: Sequelize.FLOAT(100, 2),
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATEONLY,
			allowNull: false,
		},
		expired_at: {
			type: Sequelize.DATEONLY,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "discount",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "discount_id" }],
			},
		],
	}
);
module.exports = Discount;
