const router = require("express").Router();
const shopControl = require("../controllers/shopControl");

router.route("/shop").get(shopControl.getShop).post(shopControl.createShop);

router
	.route("/shop/:id")
	.get(shopControl.getShopById)
	.delete(shopControl.deleteShop)
	.put(shopControl.updateShop);

module.exports = router;
