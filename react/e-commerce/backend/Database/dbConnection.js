const { Sequelize } = require("sequelize");

const db = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_SERVER_NAME,
		dialect: "mysql",
		pool: {
			max: 100000,
		},
	}
);

db.sync()

	.then(() => {
		console.log("connected");
	})

	.catch((err) => {
		console.log(err);
	});

module.exports = db;
