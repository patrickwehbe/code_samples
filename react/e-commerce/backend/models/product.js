const sequelize = require("sequelize");
const db = require("../Database/dbConnection");
const Product_details = require("./product_details");
// const Rating = require("./rating");
const queryInterface = db.getQueryInterface();

const Product = db.define(
	"product",
	{
		product_id: {
			type: sequelize.DataTypes.UUID,
			defaultValue: sequelize.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		product_title: {
			type: sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		product_description: {
			type: sequelize.STRING,
			allowNull: false,
		},
		product_price: {
			type: sequelize.INTEGER,
			allowNull: false,
		},
		product_image1: {
			type: sequelize.STRING,
			allowNull: false,
		},
		product_image2: {
			type: sequelize.STRING,
		},
		product_image3: {
			type: sequelize.STRING,
		},
		product_availability: {
			type: sequelize.BOOLEAN,
			defaultValue: true,
		},
		category_id: {
			type: sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "category",
				key: "category_id",
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
		product_rating: {
			type: sequelize.FLOAT,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{
		sequelize,
		tableName: "product",
		timestamps: true,
		indexes: [
			{
				name: "PRIMARY",
				unique: true,
				using: "BTREE",
				fields: [{ name: "product_id" }],
			},
			{
				name: "category_id",
				using: "BTREE",
				fields: [{ name: "category_id" }],
			},
			{
				name: "shop_id",
				using: "BTREE",
				fields: [{ name: "shop_id" }],
			},
		],
	}
);
Product.hasMany(Product_details, { foreignKey: "product_id" });
// Drop table if the Schema changed

// db.sync().then(() => {
// 	Product.sync({ force: true });
// });

//Edit Column

// queryInterface.changeColumn("product", "product_rating", {
// 	type: sequelize.FLOAT,
// 	allowNull: false,
// });

module.exports = Product;
