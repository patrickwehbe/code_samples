const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const queryInterface = db.getQueryInterface();
const Address = db.define(
	"address",
	{
		address_id: {
			autoIncrement: true,
			type: sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		address1: {
			type: sequelize.STRING(100),
			allowNull: false,
		},
		address2: {
			type: sequelize.STRING(100),
			allowNull: false,
		},
		postcode: {
			type: sequelize.STRING(100),
			allowNull: false,
		},
		city: {
			type: sequelize.STRING(100),
			allowNull: false,
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
		tableName: "address",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "address_id" }],
			},
			{
				name: "user_id",
				using: "BTREE",
				fields: [{ name: "user_id" }],
			},
		],
	}
);

//Edit Column

// queryInterface.changeColumn("address", "postcode", {
// 	type: sequelize.STRING(100),
// 	allowNull: false,
// });

module.exports = Address;
