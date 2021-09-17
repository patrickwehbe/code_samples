const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
// const queryInterface = db.getQueryInterface();

const Shop_Owner = db.define(
	"shop_owner",
	{
		shop_owner_id: {
			autoIncrement: true,
			type: sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		shop_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "shop",
				key: "shop_id",
			},
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
		tableName: "shop_owner",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "shop_owner_id" }],
			},
			{
				name: "shop_id",
				using: "BTREE",
				fields: [{ name: "shop_id" }],
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
// 	Shop_Owner.sync({ force: true });
// });

//Edit Column

// queryInterface.addColumn("user", "gender", sequelize.STRING),
// 	queryInterface.addColumn("user", "birthDate", sequelize.STRING);

module.exports = Shop_Owner;
