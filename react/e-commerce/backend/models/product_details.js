const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const Product_details = db.define(
	"product_details",
	{
		product_details_id: {
			type: sequelize.DataTypes.UUID,
			defaultValue: sequelize.DataTypes.UUIDV1,
			allowNull: false,
			primaryKey: true,
		},
		product_size: {
			type: sequelize.STRING,
		},
		product_color: {
			type: sequelize.STRING,
		},
		product_id: {
			type: sequelize.DataTypes.UUID,
			allowNull: false,
			references: {
				model: "product",
				key: "product_id",
			},
		},
	},
	{
		sequelize,
		tableName: "product_details",
		timestamps: false,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "product_details_id" }],
			},
			{
				name: "product_id",
				using: "BTREE",
				fields: [{ name: "product_id" }],
			},
		],
	}
);

// Drop table if the Schema changed

// db.sync().then(() => {
// 	Product_details.sync({ force: true });
// });

//Edit Column

// queryInterface.addColumn("user", "gender", sequelize.STRING),
// 	queryInterface.addColumn("user", "birthDate", sequelize.STRING);

module.exports = Product_details;
