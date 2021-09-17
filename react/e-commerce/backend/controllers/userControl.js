const User = require("../models/user");
const Product = require("../models/product");
const Rating = require("../models/rating");
// const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const Shop_Owner = require("../models/shop_owner");
const nodemailer = require("nodemailer");

let refreshTokens = [];
const userControl = {
	register: async (req, res) => {
		try {
			const { username, email, password } = req.body;
			const user = await User.findOne({
				where: {
					user_email: email,
				},
			});

			if (user)
				return res
					.status(400)
					.json({ msg: "Email already being used" });
			if (password.length < 6)
				return res.status(400).json({
					msg: "password should be at least 6 character long",
				});

			// password encryption
			async function hash(password) {
				return new Promise((resolve, reject) => {
					// generate random 16 bytes long salt
					const salt = crypto.randomBytes(16).toString("hex");

					crypto.scrypt(password, salt, 64, (err, derivedKey) => {
						if (err) reject(err);
						resolve(salt + ":" + derivedKey.toString("hex"));
					});
				});
			}

			const passwordHash = await hash(password);

			console.log(passwordHash);

			const newUser = await User.create({
				user_username: req.body.username,
				user_email: req.body.email,
				user_password: passwordHash,
			});
			const accesstoken = createAccessToken({ id: newUser.user_id });
			const refreshtoken = createRefreshToken({ id: newUser.user_id });

			// res.cookie("refreshtoken", refreshtoken, {
			// 	httpOnly: true,
			// 	path: "/user/refresh_token",
			// 	maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
			// 	sameSite: "none",
			// 	// secure: true,
			// });
			refreshTokens.push(refreshtoken);

			res.json({ accesstoken: accesstoken, refreshtoken: refreshtoken });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}

		// res.status(200).send(user);
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({
				where: {
					user_email: email,
				},
			});
			if (!user)
				return res.status(400).json({ msg: "User does not exist!" });
			async function verify(password, hash) {
				return new Promise((resolve, reject) => {
					const [salt, key] = hash.split(":");
					crypto.scrypt(password, salt, 64, (err, derivedKey) => {
						if (err) reject(err);
						resolve(key == derivedKey.toString("hex"));
					});
				});
			}
			const isMatch = await verify(password, user.user_password);
			if (isMatch == false)
				return res.status(400).json({ msg: "Incorrect password" });

			// If successfully logged in: create access and refresh tokens
			// res.send("logged in successfully");

			const accesstoken = createAccessToken({ id: user.user_id });
			const refreshtoken = createRefreshToken({ id: user.user_id });

			refreshTokens.push(refreshtoken);

			// res.cookie("refreshtoken", refreshtoken, {
			// 	httpOnly: true,
			// 	path: "/user/refresh_token",
			// 	maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
			// 	sameSite: "none",
			// 	// secure: true,
			// });

			res.json({ accesstoken: accesstoken, refreshtoken: refreshtoken });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	logout: async (req, res) => {
		try {
			// res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
			refreshTokens = refreshTokens.filter(
				(token) => token !== req.body.token
			);
			res.sendStatus(204);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	refreshToken: (req, res) => {
		try {
			const refreshToken = req.body.token;
			if (!refreshToken)
				return res
					.status(400)
					.json({ msg: "Please Login or Register" });
			if (!refreshTokens.includes(refreshToken))
				return res.sendStatus(403);

			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(err, user) => {
					if (err)
						return res
							.status(400)
							.json({ msg: "Please Login or Register" });

					const accesstoken = createAccessToken({ id: user.id });

					res.json({ accesstoken });
				}
			);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getUser: async (req, res) => {
		try {
			const user = await User.findOne({ where: req.user.id });
			if (!user) return res.status(400).json({ msg: "User not found" });
			res.status(200).json({
				id: user.user_id,
				name: user.user_username,
				email: user.user_email,
				role: user.user_role,
			});
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getAllUsers: async (req, res) => {
		try {
			const users = await User.findAll();
			res.send(users);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getUserById: async (req, res) => {
		try {
			const user = await User.findOne({
				where: { user_id: req.query.user_id },
			});
			if (user) {
				return res.send(user);
			} else {
				return res.status(400).json({ msg: "User not" });
			}
		} catch {
			return res.status(500).json({ msg: err.message });
		}
	},
	changeUserPassword: async (req, res) => {
		try {
			async function verify(password, hash) {
				return new Promise((resolve, reject) => {
					const [salt, key] = hash.split(":");
					crypto.scrypt(password, salt, 64, (err, derivedKey) => {
						if (err) reject(err);
						resolve(key == derivedKey.toString("hex"));
					});
				});
			}

			async function hash(password) {
				return new Promise((resolve, reject) => {
					// generate random 16 bytes long salt
					const salt = crypto.randomBytes(16).toString("hex");

					crypto.scrypt(password, salt, 64, (err, derivedKey) => {
						if (err) reject(err);
						resolve(salt + ":" + derivedKey.toString("hex"));
					});
				});
			}

			const { password, newPassword } = req.body;

			const user = await User.findOne({
				where: { user_id: req.params.id },
			});
			if (!user) {
				return res.status(400).json({ msg: "User not found" });
			}

			const isMatch = await verify(password, user.user_password);

			if (isMatch === false) {
				return res
					.status(400)
					.json({ msg: "Incorrect current password" });
			} else {
				if (newPassword.length < 6)
					return res.status(400).json({
						msg: "password should be at least 6 character long",
					});

				const passwordHash = await hash(newPassword);

				await User.update(
					{
						user_password: passwordHash,
					},
					{
						where: {
							user_id: req.params.id,
						},
					}
				);

				return res.status(200).json({
					msg: "Password Changed successfully",
				});
			}
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	changeUserInfo: async (req, res) => {
		try {
			const user = await User.findOne({
				where: {
					user_id: req.params.id,
				},
			});

			if (!user) return res.status(400).json({ msg: "user not found" });

			const newUser = await User.update(
				{
					user_username: req.body.username,
					user_username: req.body.username,
					user_email: req.body.email,
					gender: req.body.gender,
					birthDate: req.body.birthDate,
					phoneNumber: req.body.phoneNumber,
				},
				{
					where: {
						user_id: req.params.id,
					},
				}
			);
			res.status(200).json({ msg: "user updated" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	changeUserRole: async (req, res) => {
		try {
			const user = await User.findOne({
				where: {
					user_id: req.params.user_id,
				},
			});
			if (!user) return res.status(400).json({ msg: "user not found." });
			await User.update(
				{
					user_role: req.body_role,
				},
				{
					where: {
						user_id: req.params.id,
					},
				}
			);
			res.status(200).json({ msg: "User role updated successfully." });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	getShopOwnerId: async (req, res) => {
		try {
			const result = await Shop_Owner.findOne({
				where: { user_id: req.query.user_id },
			});
			if (!result)
				return res.status(400).json({ msg: "Not a shop owner" });
			res.json(result.shop_id);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	createShopOwnerId: async (req, res) => {
		try {
			const shop_owner = await Shop_Owner.create({
				user_id: req.body.user_id,
				shop_id: req.body.shop_id,
			});
			res.json(shop_owner);
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;
			const user = await User.findOne({ where: { user_email: email } });
			if (!user) return res.status(400).send("User does't exist");
			const token = createForgetToken({ id: user.user_id });

			const transporter = nodemailer.createTransport({
				host: "nitchd.com",
				port: 465,
				secure: true,
				logger: true,
				debug: true,
				ignoreTLS: true,
				auth: {
					// user: "nitchd2021@gmail.com",
					// pass: "nitchd2021@2020",
					user: "support@nitchd.com",
					pass: "ePVjM}&5(FGJ",
				},
			});

			let mailOptions = {
				from: "support@nitchd.com",
				to: email,
				subject: "Reset your account password",
				text: `Hi ${user.user_username}, You've received a request to reset the password of your Nitchd account. Kindly Press on the link below http://localhost:7000/user/forgetpassword/${user.user_id}/${token}`,
			};
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) return res.status(400).send(error.message);
				res.send("mail sent successfully");
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	resetPassword: async (req, res) => {
		try {
			const user_id = req.params.userId;
			const token = req.params.token;
			const user = await User.findOne({ where: { user_id: user_id } });
			if (!user) return res.status(400).send("User not found.");
			jwt.verify(token, process.env.FORGOT_TOKEN_SECRET, (err, user) => {
				if (err) return res.status(403).json({ msg: "forbidden" });
				res.send("Reset password form");
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	// addRating: async (req, res) => {
	// 	try {
	// 		// const user = await User.findOne({
	// 		// 	where: { user_id: req.body.user_id },
	// 		// });

	// 		// if (!user) return res.status(400).json({ msg: "user not found" });

	// 		// const product = await Product.findOne({
	// 		// 	where: { product_id: req.body.product_id },
	// 		// });
	// 		// if (!product)
	// 		// 	return res.status(400).json({ msg: "product not found" });

	// 		// const rating = await Rating.create({
	// 		// 	user_id: req.body.user_id,
	// 		// 	product_id: req.body.product_id,
	// 		// 	stars: req.body.stars,
	// 		// });
	// 		const t = await Product.findAll({
	// 			include: [
	// 				{
	// 					model: Rating,
	// 					as: "ratings",
	// 					attributes: {
	// 						include: [
	// 							"stars",
	// 							[
	// 								sequelize.fn("AVG", "ratings.stars"),
	// 								"avg_rating",
	// 							],
	// 						],
	// 						group: ["rating.stars"],
	// 					},
	// 				},
	// 			],
	// 		});

	// 		res.status(201).json({ t: t });
	// 	} catch (err) {
	// 		res.status(500).json({ msg: err.message });
	// 	}
	// },
};

const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
};
const createRefreshToken = (user) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
};
const createForgetToken = (user) => {
	return jwt.sign(user, process.env.FORGOT_TOKEN_SECRET, {
		expiresIn: "2d",
	});
};

module.exports = userControl;
