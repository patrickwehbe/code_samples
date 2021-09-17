const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const queryInterface = db.getQueryInterface();

const Shop = db.define(
	"shop",
	{
		shop_id: {
			autoIncrement: true,
			type: sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		shop_name: {
			type: sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		shop_description: {
			type: sequelize.STRING,
			allowNull: false,
		},
		shop_rating: {
			type: sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		shop_logo: {
			type: sequelize.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "shop",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "shop_id" }],
			},
		],
	}
);

// Drop table if the Schema changed

// db.sync().then(() => {
// 	User.sync({ force: true });
// });

//Edit Column

// queryInterface.changeColumn("shop", "shop_description", {
// 	type: sequelize.STRING,
// 	allowNull: false,
// });

module.exports = Shop;
