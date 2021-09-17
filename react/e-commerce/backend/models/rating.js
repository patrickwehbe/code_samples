// const sequelize = require("sequelize");
// const db = require("../Database/dbConnection");
// const Rating = db.define(
// 	"rating",
// 	{
// 		rating_id: {
// 			autoIncrement: true,
// 			type: sequelize.INTEGER,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		product_id: {
// 			type: sequelize.INTEGER,
// 			allowNull: false,
// 			references: {
// 				model: "product",
// 				key: "product_id",
// 			},
// 		},
// 		user_id: {
// 			type: sequelize.INTEGER,
// 			allowNull: false,
// 			references: {
// 				model: "user",
// 				key: "user_id",
// 			},
// 		},
// 		stars: {
// 			type: sequelize.INTEGER,
// 			validate: {
// 				min: 1,
// 				max: 5,
// 			},
// 			allowNull: false,
// 			defaultValue: 1,
// 		},
// 	},
// 	{
// 		sequelize,
// 		tableName: "rating",
// 		timestamps: false,
// 		indexes: [
// 			{
// 				name: "PRIMARY",
// 				unique: true,
// 				using: "BTREE",
// 				fields: [{ name: "rating_id" }],
// 			},
// 			{
// 				name: "product_id",
// 				using: "BTREE",
// 				fields: [{ name: "product_id" }],
// 			},
// 			{
// 				name: "user_id",
// 				using: "BTREE",
// 				fields: [{ name: "user_id" }],
// 			},
// 		],
// 	}
// );

// // Drop table if the Schema changed

// // db.sync().then(() => {
// // 	Rating.sync({ force: true });
// // });

// module.exports = Rating;
