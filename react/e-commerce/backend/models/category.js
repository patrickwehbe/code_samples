const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const Category = db.define(
	"category",
	{
		category_id: {
			autoIncrement: true,
			type: sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		category_name: {
			type: sequelize.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "category",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "category_id" }],
			},
		],
	}
);

// Drop table if the Schema changed

// db.sync().then(() => {
// 	Category.sync({ force: true });
// });

module.exports = Category;
