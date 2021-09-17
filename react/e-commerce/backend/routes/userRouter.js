const router = require("express").Router();
const userControl = require("../controllers/userControl");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

router.post("/register", userControl.register);
router.post("/login", userControl.login);
router.get("/logout", userControl.logout);
router.post("/refresh_token", userControl.refreshToken);
router.get("/info", auth, userControl.getUser);
router.get("/all", userControl.getAllUsers);
router
	.route("/shopowner")
	.get(userControl.getShopOwnerId)
	.post(userControl.createShopOwnerId);

router.get("/userinfo", userControl.getUserById);

router.put("/profile/changepassword/:id", userControl.changeUserPassword);
router.put("/profile/changeuserinfo/:id", userControl.changeUserInfo);
router.get("/profile/getuserbyid", userControl.getUserById);
router.post("/forgetpassword", userControl.forgotPassword);
router.get("/forgetpassword/:userId/:token", userControl.resetPassword);
router.post("/resetpassword", userControl.resetPassword);

router.post("/role/:id", userControl.changeUserRole);

// router.post("/rating", userControl.addRating);

module.exports = router;
